import { Hono } from "hono";
import { cors } from "hono/cors";
import searchRoutes from "./routes/search.ts";

const app = new Hono().basePath("/api");

// Professional CORS - No abstraction, just the config
app.use(
  "*",
  cors({
    origin: ["https://timtjoe.github.io", "http://localhost:3000"],
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health Check
app.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    runtime: "Bun " + Bun.version,
  });
});
app.get("/status", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    runtime: "Bun " + Bun.version,
  });
});

// Routes
app.route("/search", searchRoutes);

// Export for BOTH Bun and Vercel
export default app;
