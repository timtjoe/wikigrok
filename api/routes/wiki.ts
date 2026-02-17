// api/routes/wiki.ts
import { Hono } from 'hono';

const wiki = new Hono();

wiki.get('/', async (c) => {
  // Hono provides 'c.req.url' and easy access to query strings
  const url = new URL(c.req.url);
  const search = url.search;
  
  const WIKI_TOKEN = process.env.WIKI_ACCESS_TOKEN;
  const USER_AGENT = "WikiGrok/1.0 (timtjoe@gmail.com)";

  try {
    const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php${search}`, {
      headers: {
        Authorization: `Bearer ${WIKI_TOKEN}`,
        "User-Agent": USER_AGENT,
      },
    });

    const data = await wikiRes.json();
    return c.json(data);
  } catch (err) {
    return c.json({ error: "Proxy Failed" }, 500);
  }
});

export default wiki;