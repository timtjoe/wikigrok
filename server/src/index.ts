import { Hono } from "hono";
import searchRoutes from "./routes/search.routes";
import homeRoutes from "./routes/home.routes";
import statusRoutes from "./routes/status.routes";
import { corsMiddleware } from "./config/cors";

// This tells Hono to expect the URL to start with /api
// const app = new Hono();
const app = new Hono().basePath("/api");

app.use("*", corsMiddleware);

app.route("/", homeRoutes);       
app.route("/status", statusRoutes); 
app.route("/search", searchRoutes);

export default app;