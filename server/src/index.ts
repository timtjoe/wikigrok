import { Hono } from "hono";
import { corsMiddleware } from "./config/cors";
import { wikiMiddleware } from "./middleware/wikiProxy";

// Route Imports
import StatusRoutes from "./routes/status.routes";
import HomeRoutes from "./routes/home.routes";
import SearchRoutes from "./routes/search.routes";
import ArticleRoutes from "./routes/article.routes";
import AggregateRoutes from "./routes/aggregate.routes"; // Added this
import FeedRoutes from "./routes/feed.routes";
import RevisionRoutes from "./routes/revision.routes";

const app = new Hono();
const API_PREFIX = `/api/${process.env.API_VERSION || "v1"}`;

// --- GLOBAL MIDDLEWARE ---
app.use("*", corsMiddleware);
app.use("*", wikiMiddleware);

// --- ROUTES ---

// Public / Landing
app.route("/", HomeRoutes);

// API Endpoints
app.route(`${API_PREFIX}/status`, StatusRoutes);
app.route(`${API_PREFIX}/search`, SearchRoutes);
app.route(`${API_PREFIX}/articles`, ArticleRoutes);
app.route(`${API_PREFIX}/feed`, FeedRoutes);
app.route(`${API_PREFIX}/aggregate`, AggregateRoutes);
app.route(`${API_PREFIX}/revisions`, RevisionRoutes);
export default app;
