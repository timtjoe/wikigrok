import { Hono } from "hono";
import { Bindings } from "../types";

// --- TYPES & INTERFACES ---

/** Standard Page Object Schema (Ref: PDF Page 2) */
interface WikiPageBare {
  id: number;
  key: string;
  title: string;
  latest: {
    id: number;
    timestamp: string;
  };
  content_model: string;
  license: {
    url: string;
    title: string;
  };
  html_url: string;
}

/** History/Revision Schema (Ref: PDF Page 44) */
interface WikiRevision {
  id: number;
  timestamp: string;
  comment: string;
  user: {
    id: number;
    name: string;
  };
  delta?: number;
  size?: number;
}

const ArticleRoutes = new Hono<Bindings>();

// --- UTILS / TRANSFORMERS ---

/**
 * Normalizes titles for Wikipedia URL requirements.
 * Replaces spaces with underscores and encodes special characters.
 */
const normalizeTitle = (title: string): string => {
  return encodeURIComponent(title.replace(/\s+/g, "_"));
};

// --- ROUTES ---

/**
 * GET /api/articles/:title
 * Fetches the standard Page Object (Metadata)
 */
ArticleRoutes.get("/:title", async (c) => {
  const rawTitle = c.req.param("title");
  const encodedTitle = normalizeTitle(rawTitle);

  try {
    // Reference: PDF /page/{title}/bare
    const data = (await c.var.wiki(`/page/${encodedTitle}/bare`)) as WikiPageBare;

    return c.json({
      success: true,
      data: {
        id: data.id,
        key: data.key,
        title: data.title,
        last_updated: data.latest.timestamp,
        revision_id: data.latest.id,
        content_type: data.content_model,
        license: data.license,
        // Provide the direct link to the actual Wikipedia article
        source_url: `https://en.wikipedia.org/wiki/${data.key}`,
        // Provide our API link to fetch the rendered HTML
        html_api_url: data.html_url 
      }
    });
  } catch (err: any) {
    console.error(`Article Fetch Error [${rawTitle}]:`, err.message);
    return c.json({ 
      success: false, 
      error: "Article not found", 
      message: err.message 
    }, 404);
  }
});

/**
 * GET /api/articles/:title/history
 * Fetches the edit history/revisions for a page
 */
ArticleRoutes.get("/:title/history", async (c) => {
  const rawTitle = c.req.param("title");
  const encodedTitle = normalizeTitle(rawTitle);
  const limit = c.req.query("limit") || "20";

  try {
    // Reference: PDF Page 43 - /page/{title}/history
    const data = await c.var.wiki(`/page/${encodedTitle}/history?limit=${limit}`);
    
    const history = (data.revisions as WikiRevision[]).map(rev => ({
      id: rev.id,
      timestamp: rev.timestamp,
      author: rev.user.name,
      comment: rev.comment || "No comment provided",
      change_size: rev.delta || 0
    }));

    return c.json({
      success: true,
      title: rawTitle,
      history
    });
  } catch (err: any) {
    return c.json({ success: false, error: "History fetch failed", details: err.message }, 500);
  }
});

export default ArticleRoutes;