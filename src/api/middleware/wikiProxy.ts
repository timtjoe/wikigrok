import { Context, Next } from "hono";

export const wikiMiddleware = async (c: Context, next: Next) => {
  // We define a helper on the context "set" to make it reusable
  const wikiFetch = async (path: string) => {
    const url = `https://en.wikipedia.org/w/rest.php/v1${path}`;
    
    const response = await fetch(url, {
      headers: {
        "Api-User-Agent": `${process.env.APP_NAME} (${process.env.CONTACT_EMAIL})`,
        "Authorization": `Bearer ${process.env.WIKI_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Wikipedia API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  };

  // Attach the helper to the context variables
  c.set("wiki", wikiFetch);
  await next();
};