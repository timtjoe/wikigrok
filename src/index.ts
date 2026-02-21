import { Hono } from "hono";
import { handle } from "hono/vercel"; // Add this import
import { corsMiddleware } from "./api/config/cors";
import { wikiMiddleware } from "./api/middleware/wikiProxy";

// Route Imports
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
app.route("/api", HomeRoutes);

// API Endpoints
app.route(`${API_PREFIX}/status`, StatusRoutes);
app.route(`${API_PREFIX}/search`, SearchRoutes);
app.route(`${API_PREFIX}/articles`, ArticleRoutes);
app.route(`${API_PREFIX}/feed`, FeedRoutes);
app.route(`${API_PREFIX}/aggregate`, AggregateRoutes);
app.route(`${API_PREFIX}/revisions`, RevisionRoutes);

// --- FALLBACK ---
app.get("*", async (c) => {
  // If request is for an API path but didn't match, 404 instead of sending HTML
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "Not Found" }, 404);
  }
  
  // Send the source index.html
  return c.html(await Bun.file("./src/index.html").text());
});

// --- VERCEL ADAPTER ---
// This is the key to preventing "Function Crashed" errors
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

/**
 * For Bun Local Development
 */
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};