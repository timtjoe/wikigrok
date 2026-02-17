export default async function handler(req: Request) {
  // Handle CORS preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "https://timtjoe.github.io",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const { search } = new URL(req.url);
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

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://timtjoe.github.io",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy Failed" }), {
      status: 500,
    });
  }
}
