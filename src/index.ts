import { Hono } from "hono";
import { handle } from "hono/vercel";
import { serveStatic } from "hono/bun";
import { corsMiddleware } from "./api/config/cors";
import { wikiMiddleware } from "./api/middleware/wikiProxy";
import { join } from "path";

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

// --- 1. GLOBAL MIDDLEWARE ---
app.use("*", corsMiddleware);
app.use("*", wikiMiddleware);

// --- 2. STATIC FRONTEND (BUILT FILES) ---
app.use("/*", serveStatic({ root: "./dist" }));

// --- 3. API ROUTES ---
app.route("/api", HomeRoutes);
app.route(`${API_PREFIX}/status`, StatusRoutes);
app.route(`${API_PREFIX}/search`, SearchRoutes);
app.route(`${API_PREFIX}/articles`, ArticleRoutes);
app.route(`${API_PREFIX}/feed`, FeedRoutes);
app.route(`${API_PREFIX}/aggregate`, AggregateRoutes);
app.route(`${API_PREFIX}/revisions`, RevisionRoutes);

// --- 4. SPA FALLBACK ---
app.get("*", async (c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "API Route Not Found" }, 404);
  }

  const htmlPath = join(process.cwd(), "dist", "index.html");
  return c.html(await Bun.file(htmlPath).text());
});

// --- 5. VERCEL ADAPTER ---
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

// --- 6. LOCAL DEV ---
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch
};