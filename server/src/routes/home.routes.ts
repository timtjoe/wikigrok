import { Hono } from "hono";

const HomeRoutes = new Hono();

HomeRoutes.get("/", (c) => {
  const API_VERSION = process.env.API_VERSION || 'v1';
  const BASE = `/api/${API_VERSION}`;

  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WikiGrok API</title>
        <style>
            /* Flat Minimalist Design */
            body { 
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
                line-height: 1.5; 
                color: #1a1a1a; 
                max-width: 900px; 
                margin: 0 auto; 
                padding: 40px 20px; 
                background: #ffffff; 
            }
            header { 
                border-bottom: 2px solid #1a1a1a; 
                margin-bottom: 40px; 
                padding-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            h1 { font-size: 1.5rem; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
            h2 { font-size: 1.1rem; margin-top: 40px; text-transform: uppercase; color: #666; }
            
            .endpoint-group { border-top: 1px solid #eee; padding: 20px 0; }
            
            code { font-size: 0.95rem; background: #f0f0f0; padding: 3px 6px; }
            
            .method { font-weight: 700; width: 50px; display: inline-block; }
            .desc { color: #444; margin: 5px 0 0 55px; font-size: 0.9rem; }
            
            .tag-opt { 
                font-size: 0.7rem; 
                border: 1px solid #1a1a1a; 
                padding: 1px 5px; 
                text-transform: uppercase; 
                margin-left: 10px; 
                font-weight: bold;
            }

            footer { margin-top: 60px; font-size: 0.8rem; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
    </head>
    <body>
        <header>
            <h1>WikiGrok Index</h1>
            <span>Status: 200 OK</span>
        </header>
        
        <h2>Core Endpoints</h2>
        
        <div class="endpoint-group">
            <span class="method">GET</span> <code>${BASE}/search/advanced?q={term}</code>
            <p class="desc">Search with thumbnails, description, and page excerpts.</p>
        </div>

        <div class="endpoint-group">
            <span class="method">GET</span> <code>${BASE}/aggregate/:title</code> <span class="tag-opt">Optimized</span>
            <p class="desc">Parallel fetch: Metadata, Content, History, Image, and Related topics.</p>
        </div>

        <div class="endpoint-group">
            <span class="method">GET</span> <code>${BASE}/feed/news</code>
            <p class="desc">Curated "In the News" items with sanitized story text.</p>
        </div>

        <div class="endpoint-group">
            <span class="method">GET</span> <code>${BASE}/revisions/:from/compare/:to</code>
            <p class="desc">Structural diff between revisions using PDF spec 1.35.</p>
        </div>

        <footer>
            API_VERSION: ${API_VERSION} | 
            ENV: ${process.env.NODE_ENV || 'prod'} | 
            TIMESTAMP: ${new Date().toISOString()}
        </footer>
    </body>
    </html>
  `);
});

export default HomeRoutes;