// api/index.ts
export default async function handler(req: Request) {
  const url = new URL(req.url);

  // Health check route
  if (url.pathname === "/api/status") {
    return Response.json({ status: "alive", runtime: "bun" });
  }

  // Wikipedia Proxy route
  if (url.pathname === "/api/wiki") {
    const wikiParams = url.search;
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php${wikiParams}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.WIKI_ACCESS_TOKEN}`,
          "User-Agent": "WikiGrok/1.0",
        },
      },
    );
    const data = await wikiRes.json();
    return Response.json(data);
  }

  return new Response("Not Found", { status: 404 });
}
