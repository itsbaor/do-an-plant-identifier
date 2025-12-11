import { Router } from "express";
import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware, AuthRequest } from "./middleware/auth";

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

type PlantRow = RowDataPacket & {
  id: number;
  user_id: number;
  name: string;
  image: string;
  tree_like: string;
  type: string;
  water_level: string;
  sun_level: string;
  growth?: string;
  category?: string;
  created_at: Date;
  updated_at: Date;
};

// GET /api/plants - Fetch all plants for authenticated user
router.get("/", async (req: AuthRequest, res) => {
  try {
    const pool = await db.getPool();
    const [rows] = await pool.execute<PlantRow[]>(
      "SELECT * FROM plants WHERE user_id = ? ORDER BY created_at DESC",
      [req.userId]
    );

    // Parse JSON category field
    const plants = rows.map((row) => ({
      ...row,
      category: row.category ? JSON.parse(row.category) : null,
    }));

    return res.json({ plants });
  } catch (error) {
    console.error("Error fetching plants:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/plants - Add new plant
router.post("/", async (req: AuthRequest, res) => {
  try {
    const {
      name,
      image,
      treeLike,
      type,
      waterlevel,
      sunlevel,
      growth,
      category,
    } = req.body;

    if (!name || !image || !treeLike || !type || !waterlevel || !sunlevel) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pool = await db.getPool();

    // Check for duplicate plant name for this user
    const [existing] = await pool.execute<PlantRow[]>(
      "SELECT id FROM plants WHERE user_id = ? AND name = ? LIMIT 1",
      [req.userId, name]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Plant with this name already exists" });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO plants (user_id, name, image, tree_like, type, water_level, sun_level, growth, category)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        name,
        image,
        treeLike,
        type,
        waterlevel,
        sunlevel,
        growth || null,
        category ? JSON.stringify(category) : null,
      ]
    );

    return res.status(201).json({
      message: "Plant added successfully",
      plantId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding plant:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/plants/:name - Remove plant by name
router.delete("/:name", async (req: AuthRequest, res) => {
  try {
    const { name } = req.params;
    const pool = await db.getPool();

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM plants WHERE user_id = ? AND name = ?",
      [req.userId, name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plant not found" });
    }

    return res.json({ message: "Plant removed successfully" });
  } catch (error) {
    console.error("Error removing plant:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/plants/bulk - Bulk upload plants (for migration)
router.post("/bulk", async (req: AuthRequest, res) => {
  try {
    const { plants } = req.body;

    if (!Array.isArray(plants) || plants.length === 0) {
      return res.status(400).json({ error: "Invalid plants array" });
    }

    const pool = await db.getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let inserted = 0;
      let skipped = 0;

      for (const plant of plants) {
        const {
          name,
          image,
          treeLike,
          type,
          waterlevel,
          sunlevel,
          growth,
          category,
        } = plant;

        // Check for duplicates
        const [existing] = await connection.execute<PlantRow[]>(
          "SELECT id FROM plants WHERE user_id = ? AND name = ? LIMIT 1",
          [req.userId, name]
        );

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        await connection.execute(
          `INSERT INTO plants (user_id, name, image, tree_like, type, water_level, sun_level, growth, category)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.userId,
            name,
            image,
            treeLike,
            type,
            waterlevel,
            sunlevel,
            growth || null,
            category ? JSON.stringify(category) : null,
          ]
        );
        inserted++;
      }

      await connection.commit();

      return res.json({
        message: "Bulk upload completed",
        inserted,
        skipped,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error bulk uploading plants:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
