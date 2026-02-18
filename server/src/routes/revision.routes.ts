import { Hono } from "hono";
import { Bindings } from "../types";

// --- TYPES (Mapped from PDF Pages 49-52) ---

interface DiffItem {
  type: number; // 0: Context, 1: Added, 2: Deleted, 3: Changed
  from?: string;
  to?: string;
  diff?: {
    highlightRanges?: Array<{
      start: number;
      length: number;
      type: number; // 0: Add, 1: Delete
    }>;
  };
}

const RevisionRoutes = new Hono<Bindings>();

// --- ROUTE ---

/**
 * GET /api/v1/revisions/:from/compare/:to
 * Reference: PDF Page 49 - Compare two revisions
 */
RevisionRoutes.get("/:from/compare/:to", async (c) => {
  const from = c.req.param("from");
  const to = c.req.param("to");

  try {
    // Reference: Path /revision/{from}/compare/{to}
    const data = await c.var.wiki(`/revision/${from}/compare/${to}`);

    // Map the complex diff objects into a frontend-friendly Audit format
    const diffs = (data.diff || []).map((item: any) => ({
      type: item.type, // We keep the type for CSS coloring (0: gray, 1: green, 2: red)
      lineNumber: item.lineNumber || null,
      content: {
        old: item.from || null,
        new: item.to || null
      },
      // Highlights tell the UI exactly which words changed within a line
      highlights: item.diff?.highlightRanges || []
    }));

    // PERFORMANCE: These comparisons are static, so we cache them heavily
    c.header("Cache-Control", "public, s-maxage=86400"); // Cache for 24 hours

    return c.json({
      success: true,
      comparison: {
        from_id: from,
        to_id: to,
        diffs
      }
    });
  } catch (err: any) {
    return c.json({ 
      success: false, 
      error: "Revision comparison failed", 
      details: err.message 
    }, 500);
  }
});

export default RevisionRoutes;