import { Hono } from "hono";
import { Bindings } from "../types";

const FeedRoutes = new Hono<Bindings>();

// --- UTILS ---

/** Gets current date in YYYY/MM/DD for the Feed API */
const getTodayPath = () => {
  const now = new Date();
  return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;
};

// --- ROUTES ---

/**
 * GET /api/v1/feed/trending
 * Returns the most-read articles on Wikipedia for the current day.
 */
FeedRoutes.get("/trending", async (c) => {
  try {
    const data = await c.var.wiki(`/feed/featured/${getTodayPath()}`);

    const trending = (data.mostread?.articles || []).map((page: any) => ({
      id: page.id,
      key: page.key,
      title: page.title,
      description: page.description || "Trending Topic",
      views: page.views, // Views in the last 24h
      thumbnail: page.thumbnail?.url ? `https:${page.thumbnail.url}` : null,
      url: `https://en.wikipedia.org/wiki/${page.key}`,
    }));

    // OPTIMIZATION: Cache for 1 hour as trending data updates daily/hourly
    c.header(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=600",
    );
    return c.json({ success: true, count: trending.length, results: trending });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: "Trending feed unavailable",
        details: err.message,
      },
      500,
    );
  }
});

/**
 * GET /api/v1/feed/news
 * Returns the "In the News" items with cleaned stories and related article links.
 */
FeedRoutes.get("/news", async (c) => {
  try {
    const data = await c.var.wiki(`/feed/featured/${getTodayPath()}`);

    const newsItems = (data.news || []).map((item: any) => ({
      // Clean HTML tags from the story text
      story: item.story.replace(/<[^>]*>?/gm, "").trim(),
      // Map related articles for the news item
      links: item.links.map((page: any) => ({
        key: page.key,
        title: page.title,
        description: page.description,
        thumbnail: page.thumbnail?.url ? `https:${page.thumbnail.url}` : null,
      })),
    }));

    c.header("Cache-Control", "public, s-maxage=3600");
    return c.json({ success: true, results: newsItems });
  } catch (err: any) {
    return c.json(
      { success: false, error: "News feed unavailable", details: err.message },
      500,
    );
  }
});

export default FeedRoutes;
