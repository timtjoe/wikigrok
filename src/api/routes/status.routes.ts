import { Hono } from "hono";

const StatusRoutes = new Hono();

StatusRoutes.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    runtime: "Bun " + Bun.version,
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION,
    developer: "Tim T. Joe/timtjoe@gmail.com",
    name: process.env.APP_NAME,
  });
});

export default StatusRoutes;
