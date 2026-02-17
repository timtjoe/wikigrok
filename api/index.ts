import { Hono } from "hono";
import { cors } from "hono/cors";
import searchRoutes from "./routes/search.routes.ts";
import homeRoutes from "./routes/home.routes.ts";
import statusRoutes from "./routes/status.routes.ts";
import { corsMiddleware } from "./config/cors.ts";

const app = new Hono().basePath("/api");

// Middlewares
app.use("*", corsMiddleware);

// Routes
app.route("/", homeRoutes);
app.route("/status", statusRoutes);
app.route("/search", searchRoutes);

export default app;
