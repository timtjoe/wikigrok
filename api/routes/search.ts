import { Hono } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

const search = new Hono();

// Define a proper interface for your error responses
interface SearchError {
  error: string;
  details?: string;
  status?: number;
}

search.get('/', async (c) => {
  const q = c.req.query('q') || 'jupiter';
  const limit = c.req.query('limit') || '20';

  const params = new URLSearchParams({ q, limit });
  const url = `https://en.wikipedia.org/w/rest.php/v1/search/page?${params}`;

  const headers = {
    'Api-User-Agent': 'WikiGrok/1.0 (https://github.com/timtjoe/wikigrok)',
    'Authorization': `Bearer ${process.env.WIKI_ACCESS_TOKEN}`
  };

  try {
    const rsp = await fetch(url, { headers });

    // Handle Wikipedia API errors
    if (!rsp.ok) {
      // FIX: Cast the number to ContentfulStatusCode to satisfy the overload
      const status = rsp.status as ContentfulStatusCode;
      
      const errorData: SearchError = { 
        error: 'Wikipedia API Error', 
        status: rsp.status 
      };

      return c.json(errorData, status);
    }

    const data = await rsp.json();
    return c.json(data);

  } catch (err) {
    const errorData: SearchError = { 
      error: 'Proxy Connection Failed', 
      details: err instanceof Error ? err.message : 'Unknown' 
    };

    // Use a hardcoded valid status for local errors
    return c.json(errorData, 500);
  }
});

export default search;