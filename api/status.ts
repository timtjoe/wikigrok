export default function handler() {
  return new Response(JSON.stringify({ 
    status: "WikiGrok API is Live", 
    runtime: "Bun " + Bun.version,
    timestamp: new Date().toISOString() 
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}