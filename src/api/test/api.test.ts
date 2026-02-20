import { expect, test, describe } from "bun:test";

const BASE_URL = `http://localhost:3000/api/${process.env.API_VERSION || 'v1'}`;

describe("Wikipedia API Proxy Tests", () => {
  
  // Test 1: Search Logic
  test("GET /search/query - should return rich results", async () => {
    const res = await fetch(`${BASE_URL}/search/query?q=Earth&limit=1`);
    const body = await res.json();
    
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.results[0]).toHaveProperty("description");
    expect(body.results[0].url).toContain("wikipedia.org");
  });

  // Test 2: Aggregator Logic
  test("GET /aggregate/:title - should return consolidated data", async () => {
    const res = await fetch(`${BASE_URL}/aggregate/Jupiter`);
    const body = await res.json();
    
    expect(res.status).toBe(200);
    expect(body.article.title).toBe("Jupiter");
    expect(body.article).toHaveProperty("thumbnail");
    expect(body.recent_activity.length).toBeGreaterThan(0);
    expect(body.related_topics.length).toBeGreaterThan(0);
  });

  // Test 3: News Feed
  test("GET /feed/news - should return sanitized news stories", async () => {
    const res = await fetch(`${BASE_URL}/feed/news`);
    const body = await res.json();
    
    expect(res.status).toBe(200);
    expect(Array.isArray(body.results)).toBe(true);
    // Ensure HTML tags were stripped by our transformer
    if (body.results.length > 0) {
      expect(body.results[0].story).not.toContain("<a href=");
    }
  });

  // Test 4: Revision Comparison (Page 49 of PDF)
  test("GET /revisions/:from/compare/:to - should return git-style diffs", async () => {
    // Using known revision IDs from the PDF example or general ones
    const res = await fetch(`${BASE_URL}/revisions/1244080126/compare/1244081000`);
    const body = await res.json();
    
    expect(res.status).toBe(200);
    expect(body.comparison).toHaveProperty("diffs");
    expect(body.comparison.diffs[0]).toHaveProperty("type"); // 0, 1, 2, or 3
  });
});