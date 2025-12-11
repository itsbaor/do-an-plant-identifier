import { Router } from "express";
import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware, adminMiddleware, AuthRequest } from "./middleware/auth";

const router = Router();

type ArticleRow = RowDataPacket & {
  id: number;
  title: string;
  description: string | null;
  content: string;
  image_url: string | null;
  category: string | null;
  author_id: number;
  author_name?: string;
  is_published: boolean;
  views: number;
  created_at: Date;
  updated_at: Date;
};

// Admin routes first (before /:id route to avoid conflicts)

// GET /api/articles/admin/stats - Get article statistics (admin only)
router.get("/admin/stats", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const pool = await db.getPool();

    const [total] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM articles"
    );

    const [published] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM articles WHERE is_published = TRUE"
    );

    const [totalViews] = await pool.execute<RowDataPacket[]>(
      "SELECT SUM(views) as total FROM articles WHERE is_published = TRUE"
    );

    const [byCategory] = await pool.execute<RowDataPacket[]>(
      "SELECT category, COUNT(*) as count FROM articles WHERE is_published = TRUE GROUP BY category"
    );

    return res.json({
      total: total[0].count,
      published: published[0].count,
      unpublished: total[0].count - published[0].count,
      totalViews: totalViews[0].total || 0,
      byCategory
    });
  } catch (error) {
    console.error("Error fetching article stats:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/articles/admin/all - Get all articles including unpublished (admin only)
router.get("/admin/all", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, published } = req.query;
    const pool = await db.getPool();

    let query = `
      SELECT
        a.id, a.title, a.description, a.content, a.image_url,
        a.category, a.is_published, a.views, a.created_at, a.updated_at,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      query += " AND a.category = ?";
      params.push(category);
    }

    if (published !== undefined) {
      query += " AND a.is_published = ?";
      params.push(published === 'true' ? 1 : 0);
    }

    query += " ORDER BY a.created_at DESC";

    const [rows] = await pool.execute<ArticleRow[]>(query, params);

    return res.json({ articles: rows });
  } catch (error) {
    console.error("Error fetching all articles:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Public routes

// GET /api/articles - Get published articles (public)
router.get("/", async (req: AuthRequest, res) => {
  try {
    const { category, limit = "20", offset = "0" } = req.query;
    const pool = await db.getPool();

    let query = `
      SELECT
        a.id, a.title, a.description, a.content, a.image_url,
        a.category, a.views, a.created_at, a.updated_at,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.is_published = TRUE
    `;
    const params: any[] = [];

    if (category) {
      query += " AND a.category = ?";
      params.push(category);
    }

    query += " ORDER BY a.created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit as string), parseInt(offset as string));

    const [rows] = await pool.execute<ArticleRow[]>(query, params);

    return res.json({ articles: rows });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/articles/:id - Get single article (public, increments views)
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getPool();

    const [rows] = await pool.execute<ArticleRow[]>(
      `SELECT
        a.id, a.title, a.description, a.content, a.image_url,
        a.category, a.views, a.is_published, a.created_at, a.updated_at,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const article = rows[0];

    // Only show unpublished articles to admins
    if (!article.is_published && req.userRole !== 'admin') {
      return res.status(404).json({ error: "Article not found" });
    }

    // Increment view count for published articles
    if (article.is_published) {
      await pool.execute(
        "UPDATE articles SET views = views + 1 WHERE id = ?",
        [id]
      );
      article.views += 1;
    }

    return res.json({ article });
  } catch (error) {
    console.error("Error fetching article:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Admin write routes (create, update, delete) - require authentication

// POST /api/articles - Create article (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, description, content, image_url, category, is_published = false } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const pool = await db.getPool();

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO articles
       (title, description, content, image_url, category, author_id, is_published)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description?.trim() || null,
        content.trim(),
        image_url?.trim() || null,
        category?.trim() || null,
        req.userId,
        is_published
      ]
    );

    return res.status(201).json({
      message: "Article created successfully",
      articleId: result.insertId
    });
  } catch (error) {
    console.error("Error creating article:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/articles/:id - Update article (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, image_url, category, is_published } = req.body;

    const pool = await db.getPool();

    // Check if article exists
    const [existing] = await pool.execute<ArticleRow[]>(
      "SELECT id FROM articles WHERE id = ? LIMIT 1",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title.trim());
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description?.trim() || null);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      values.push(content.trim());
    }
    if (image_url !== undefined) {
      updates.push("image_url = ?");
      values.push(image_url?.trim() || null);
    }
    if (category !== undefined) {
      updates.push("category = ?");
      values.push(category?.trim() || null);
    }
    if (is_published !== undefined) {
      updates.push("is_published = ?");
      values.push(is_published);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    await pool.execute(
      `UPDATE articles SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    // Get updated article
    const [rows] = await pool.execute<ArticleRow[]>(
      `SELECT
        a.id, a.title, a.description, a.content, a.image_url,
        a.category, a.is_published, a.views, a.created_at, a.updated_at,
        u.name as author_name
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ? LIMIT 1`,
      [id]
    );

    return res.json({
      message: "Article updated successfully",
      article: rows[0]
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/articles/:id - Delete article (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getPool();

    // Check if article exists
    const [rows] = await pool.execute<ArticleRow[]>(
      "SELECT id FROM articles WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await pool.execute("DELETE FROM articles WHERE id = ?", [id]);

    return res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/articles/:id/publish - Toggle publish status (admin only)
router.put("/:id/publish", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      return res.status(400).json({ error: "is_published must be a boolean" });
    }

    const pool = await db.getPool();

    // Check if article exists
    const [existing] = await pool.execute<ArticleRow[]>(
      "SELECT id FROM articles WHERE id = ? LIMIT 1",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await pool.execute(
      "UPDATE articles SET is_published = ? WHERE id = ?",
      [is_published, id]
    );

    return res.json({
      message: is_published ? "Article published successfully" : "Article unpublished successfully"
    });
  } catch (error) {
    console.error("Error updating publish status:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
