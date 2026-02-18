import { Hono } from "hono";

const StatusRoutes = new Hono();

StatusRoutes.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    runtime: "Bun " + Bun.version,
    api_version: process.env.API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

export default StatusRoutes;
