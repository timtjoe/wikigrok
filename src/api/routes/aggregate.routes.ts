import { Hono } from "hono";
import type { Bindings } from "../types";

// --- TYPES (Strictly mapped from PDF) ---

interface WikiPageBare {
  id: number;
  key: string;
  title: string;
  latest: { id: number; timestamp: string };
  license: { url: string; title: string };
}

/** * Optimization: Using 'with_html' result as a source for both metadata
 * and preview to reduce request count if possible.
 */
interface WikiPageHtml extends WikiPageBare {
  html: string;
}

const AggregateRoutes = new Hono<Bindings>();

// --- UTILS ---

const normalizeTitle = (title: string): string =>
  encodeURIComponent(title.replace(/\s+/g, "_"));

const createTextPreview = (html: string, length: number = 500): string => {
  if (!html) return "";
  // More performant regex for stripping tags
  const plainText = html
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return plainText.length > length
    ? plainText.substring(0, length) + "..."
    : plainText;
};

// --- ROUTE ---

AggregateRoutes.get("/:title", async (c) => {
  const rawTitle = c.req.param("title");
  const encodedTitle = normalizeTitle(rawTitle);

  try {
    /**
     * PERFORMANCE REFACTOR:
     * We consolidated 4 calls into 3.
     * We use 'with_html' instead of 'bare' because 'with_html'
     * contains the full Page Object AND the content.
     */
    const [pageData, historyData, searchData] = await Promise.all([
      c.var.wiki(`/page/${encodedTitle}/with_html`) as Promise<WikiPageHtml>,
      c.var.wiki(`/page/${encodedTitle}/history?limit=5`),
      c.var.wiki(`/search/title?q=${encodedTitle}&limit=4`),
    ]);

    // OPTIMIZATION: Check if searchData exists to avoid crashing on empty results
    const pages = searchData?.pages || [];
    const currentMatch = pages.find((p: any) => p.key === pageData.key);

    // REDUNDANCY CHECK: Extract related topics only if search returned extra results
    const related = pages
      .filter((p: any) => p.key !== pageData.key)
      .slice(0, 3)
      .map((p: any) => ({
        key: p.key,
        title: p.title,
        description: p.description || "Related article",
        thumbnail: p.thumbnail?.url ? `https:${p.thumbnail.url}` : null,
      }));

    // FINAL RESPONSE MAPPING
    const response = {
      success: true,
      article: {
        id: pageData.id,
        title: pageData.title,
        key: pageData.key,
        thumbnail: currentMatch?.thumbnail?.url
          ? `https:${currentMatch.thumbnail.url}`
          : null,
        description: currentMatch?.description || "",
        last_updated: pageData.latest.timestamp,
        preview: createTextPreview(pageData.html, 600),
        source_url: `https://en.wikipedia.org/wiki/${pageData.key}`,
        license: pageData.license,
      },
      recent_activity: (historyData.revisions || []).map((rev: any) => ({
        id: rev.id,
        timestamp: rev.timestamp,
        author: rev.user.name,
        comment: rev.comment || "",
        delta: rev.delta || 0,
      })),
      related_topics: related,
    };

    /**
     * RATE LIMITING PROTECTION:
     * Instruct the browser and Vercel Edge Network to cache this result
     * for 1 hour. This significantly reduces the load on the Wikipedia API.
     */
    c.header(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=600",
    );

    return c.json(response);
  } catch (err: any) {
    console.error(
      `Aggregator bottleneck or 404 at [${rawTitle}]:`,
      err.message,
    );

    // Intelligent Error Response
    const statusCode = err.message.includes("429") ? 429 : 404;
    return c.json(
      {
        success: false,
        error:
          statusCode === 429
            ? "Rate limit reached"
            : "Article aggregation failed",
        details: err.message,
      },
      statusCode,
    );
  }
});

export default AggregateRoutes;
