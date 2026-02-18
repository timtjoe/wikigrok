import { Hono } from "hono";
import { corsMiddleware } from "./config/cors";
import StatusRoutes from "./routes/status.routes";
import HomeRoutes from "./routes/home.routes";
import SearchRoutes from "./routes/search.routes";

// INSTANCES
const app = new Hono();

// MIDDLEWARE
app.use("*", corsMiddleware);

// ROUTES
app.route("/", HomeRoutes);
app.route(`/api/${process.env.API_VERSION}/status`, StatusRoutes);
app.route(`/api/${process.env.API_VERSION}/search`, SearchRoutes);

export default app;
