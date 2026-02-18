import { Hono } from "hono";

const status = new Hono();

status.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    runtime: "Bun " + Bun.version,
    timestamp: new Date().toISOString(),
  });
});

export default status;