import app from "./index";

console.log("🔥 Bun HMR active at http://localhost:3001");

const server = Bun.serve({
  port: 3001,
  fetch: app.fetch,
});

// Optional: Force a console log on every reload so you know it worked
console.log(`[${new Date().toLocaleTimeString()}] API updated`);