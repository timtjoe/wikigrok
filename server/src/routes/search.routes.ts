import { Hono } from "hono";
import { Bindings } from "../types";

// --- TYPES & INTERFACES ---

/** Official MediaWiki Search Result Schema from Reference */
interface WikiPageResult {
  id: number;
  key: string;
  title: string;
  description?: string;
  excerpt?: string;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
}

/** Standardized WikiGrok Output */
interface SearchResponse {
  id: number;
  key: string;
  title: string;
  description: string;
  excerpt: string;
  thumbnail: string | null;
  url: string;
}

const SearchRoutes = new Hono<Bindings>();

// --- UTILS / TRANSFORMERS ---

/**
 * Transforms raw MediaWiki data into our clean platform schema.
 * Prepend https: to thumbnails and provides fallbacks for missing data.
 */
const transformWikiResult = (page: WikiPageResult): SearchResponse => ({
  id: page.id,
  key: page.key,
  title: page.title,
  description: page.description || "No description available",
  excerpt: page.excerpt || "", // Note: Contains <span class="searchmatch">
  thumbnail: page.thumbnail?.url ? `https:${page.thumbnail.url}` : null,
  url: `https://en.wikipedia.org/wiki/${page.key}`,
});

// --- ROUTES ---

/**
 * 1. Full Content Search (Main Results)
 * Uses /search/page to look through article content.
 */
SearchRoutes.get("/query", async (c) => {
  const q = c.req.query("q");
  const limit = c.req.query("limit") || "20";

  if (!q) return c.json({ success: false, error: "Query parameter 'q' is required" }, 400);

  try {
    // Reference: PDF Page 12 - /search/page
    const data = await c.var.wiki(`/search/page?q=${encodeURIComponent(q)}&limit=${limit}`);
    
    const results = (data.pages as WikiPageResult[]).map(transformWikiResult);

    return c.json({
      success: true,
      count: results.length,
      results
    });
  } catch (err: any) {
    return c.json({ success: false, error: "Wikipedia search failed", details: err.message }, 500);
  }
});

/**
 * 2. Live Autocomplete Suggestions
 * Uses /search/title for fast typeahead matching.
 */
SearchRoutes.get("/suggestions", async (c) => {
  const q = c.req.query("q");
  const limit = c.req.query("limit") || "10";

  if (!q) return c.json({ success: false, suggestions: [] });

  try {
    // Reference: PDF Page 16 - /search/title
    const data = await c.var.wiki(`/search/title?q=${encodeURIComponent(q)}&limit=${limit}`);
    
    const suggestions = (data.pages as WikiPageResult[]).map(transformWikiResult);

    return c.json({
      success: true,
      suggestions
    });
  } catch (err: any) {
    return c.json({ success: false, error: "Suggestions fetch failed", details: err.message }, 500);
  }
});

/**
 * GET /api/v1/search/advanced
 * Enhanced search with post-fetch filtering and higher limits.
 */
SearchRoutes.get("/advanced", async (c) => {
  const q = c.req.query("q");
  const limit = c.req.query("limit") || "50";
  const hasImage = c.req.query("hasImage") === "true";

  if (!q) return c.json({ success: false, error: "Search term 'q' required" }, 400);

  try {
    // Ref Page 12: /search/page endpoint
    const data = await c.var.wiki(`/search/page?q=${encodeURIComponent(q)}&limit=${limit}`);
    
    let results = (data.pages || []).map((page: any) => ({
      id: page.id,
      key: page.key,
      title: page.title,
      description: page.description,
      excerpt: page.excerpt, // Snippet with highlights
      thumbnail: page.thumbnail?.url ? `https:${page.thumbnail.url}` : null
    }));

    // PERFORMANCE OPTIMIZATION: Filter results locally to avoid redundant API calls
    if (hasImage) {
      results = results.filter((r: any) => r.thumbnail !== null);
    }

    c.header("Cache-Control", "public, s-maxage=1800"); // Cache search for 30 mins
    return c.json({ success: true, count: results.length, results });
  } catch (err: any) {
    return c.json({ success: false, error: "Advanced search failed", details: err.message }, 500);
  }
});

export default SearchRoutes;