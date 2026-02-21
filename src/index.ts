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

// --- 2. STATIC ASSETS (The "No-Build" Magic) ---
// This tells Hono to serve files from /src directly.
// Bun will automatically handle the .tsx -> .js conversion on the fly.
app.use("/src/*", serveStatic({ root: "./" }));

// --- 3. API ROUTES ---
app.route("/api", HomeRoutes);
app.route(`${API_PREFIX}/status`, StatusRoutes);
app.route(`${API_PREFIX}/search`, SearchRoutes);
app.route(`${API_PREFIX}/articles`, ArticleRoutes);
app.route(`${API_PREFIX}/feed`, FeedRoutes);
app.route(`${API_PREFIX}/aggregate`, AggregateRoutes);
app.route(`${API_PREFIX}/revisions`, RevisionRoutes);

// --- 4. SPA FALLBACK ---
// If the request isn't for an API or a specific file in /src, send index.html
app.get("*", async (c) => {
  if (c.req.path.startsWith("/api/")) {
    return c.json({ error: "API Route Not Found" }, 404);
  }

  try {
    const htmlPath = join(process.cwd(), "src", "index.html");
    const content = await Bun.file(htmlPath).text();
    return c.html(content);
  } catch (err) {
    return c.text("index.html not found in src/ folder", 404);
  }
});

// --- 5. VERCEL ADAPTER ---
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

// --- 6. LOCAL DEV (bun run src/index.ts) ---
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};