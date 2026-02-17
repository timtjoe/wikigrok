import { Hono } from "hono";
import searchRoutes from "./routes/search.routes.ts";
import homeRoutes from "./routes/home.routes.ts";
import statusRoutes from "./routes/status.routes.ts";
import { corsMiddleware } from "./config/cors.ts";

// 1. Remove .basePath("/api")
const app = new Hono();

// Middlewares
app.use("*", corsMiddleware);

app.route("/api", homeRoutes);        
app.route("/api/status", statusRoutes); 
app.route("/api/search", searchRoutes);

export default app;