import { cors } from "hono/cors";

export const corsOptions = {
  origin: ["https://timtjoe.github.io", "http://localhost:3000"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
};

export const corsMiddleware = cors(corsOptions);
