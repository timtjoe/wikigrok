import { Hono } from "hono";
import { serve } from "bun"; // Required for local development
import { corsMiddleware } from "./api/config/cors";
import { wikiMiddleware } from "./api/middleware/wikiProxy";

// Route Imports (Pointed to your api/ folder)
import StatusRoutes from "./api/routes/status.routes";
import HomeRoutes from "./api/routes/home.routes";
import SearchRoutes from "./api/routes/search.routes";
import ArticleRoutes from "./api/routes/article.routes";
import AggregateRoutes from "./api/routes/aggregate.routes";
import FeedRoutes from "./api/routes/feed.routes";
import RevisionRoutes from "./api/routes/revision.routes";

const app = new Hono();
const API_PREFIX = `/api/${process.env.API_VERSION || "v1"}`;

// --- GLOBAL MIDDLEWARE ---
app.use("*", corsMiddleware);
app.use("*", wikiMiddleware);

// --- ROUTES ---

// Public / Landing (Optional, usually handled by React, but kept for your logic)
app.route("/api", HomeRoutes);

// API Endpoints
app.route(`${API_PREFIX}/status`, StatusRoutes);
app.route(`${API_PREFIX}/search`, SearchRoutes);
app.route(`${API_PREFIX}/articles`, ArticleRoutes);
app.route(`${API_PREFIX}/feed`, FeedRoutes);
app.route(`${API_PREFIX}/aggregate`, AggregateRoutes);
app.route(`${API_PREFIX}/revisions`, RevisionRoutes);

// 2. Simple Fallback
// If it's not an API call, just send the index.html file directly
app.get("*", async (c) => {
  return c.html(await Bun.file("./src/index.html").text());
});

/**
 * For Vercel & Bun Native:
 * Vercel looks for a default export that has a 'fetch' method.
 * Bun's native 'serve' also looks for 'fetch'.
 */
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};