import { Hono } from "hono";

const HomeRoutes = new Hono();

HomeRoutes.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    endpoints: ["/search", "/articles", "/news"],
    timestamp: new Date().toISOString(),
  });
});

HomeRoutes.post("/", async (c) => {
  const data = await c.req.json();
  return c.json(data);
});

HomeRoutes.put("/", async (c) => {
  const data = await c.req.json();
  return c.json(data);
});

HomeRoutes.delete("/", async (c) => {
  const data = await c.req.json();
  return c.json({
    message: "Data deleted successfully",
    deletedData: data,
  });
});

export default HomeRoutes;
