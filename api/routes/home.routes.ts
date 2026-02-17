import { Hono } from "hono";

const home = new Hono();

// 1. READ (Home) - Return basic text
home.get("/", (c) => {
  return c.json({
    status: "WikiGrok API is Live",
    endpoints: ["/search", "/status", "/home"],
  });
});

// 2. CREATE - Return the data sent to it
home.post("/", async (c) => {
  const data = await c.req.json();
  return c.json(data);
});

// 3. UPDATE (PUT) - Return the data sent to it
home.put("/", async (c) => {
  const data = await c.req.json();
  return c.json(data);
});

// 4. DELETE - Delete the data sent and send a message back
home.delete("/", async (c) => {
  const data = await c.req.json();
  return c.json({
    message: "Data deleted successfully",
    deletedData: data,
  });
});

export default home;
