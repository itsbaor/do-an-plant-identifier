import { Router } from "express";
import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware, adminMiddleware, AuthRequest } from "./middleware/auth";

const router = Router();
router.use(authMiddleware);
router.use(adminMiddleware);

type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: Date;
};

// GET /api/users - List all users (admin only)
router.get("/", async (req: AuthRequest, res) => {
  try {
    const pool = await db.getPool();
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC"
    );

    return res.json({ users: rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/:id - Get single user (admin only)
router.get("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const pool = await db.getPool();

    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/users/:id - Update user (admin only)
router.put("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_active } = req.body;

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'user' or 'admin'" });
    }

    // Prevent admin from deactivating themselves
    if (req.userId === parseInt(id) && is_active === false) {
      return res.status(400).json({ error: "Cannot deactivate your own account" });
    }

    // Prevent admin from demoting themselves
    if (req.userId === parseInt(id) && role === 'user') {
      return res.status(400).json({ error: "Cannot remove your own admin role" });
    }

    const pool = await db.getPool();

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.trim());
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email.trim().toLowerCase());
    }
    if (role !== undefined) {
      updates.push("role = ?");
      values.push(role);
    }
    if (is_active !== undefined) {
      updates.push("is_active = ?");
      values.push(is_active);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    await pool.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    // Get updated user
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return res.json({
      message: "User updated successfully",
      user: rows[0]
    });
  } catch (error: any) {
    console.error("Error updating user:", error);

    // Handle duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Email already exists" });
    }

    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.userId === parseInt(id)) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    const pool = await db.getPool();

    // Check if user exists
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete user (CASCADE will handle related data)
    await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /api/users/stats - Get user statistics (admin only)
router.get("/admin/stats", async (req: AuthRequest, res) => {
  try {
    const pool = await db.getPool();

    const [totalUsers] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users"
    );

    const [activeUsers] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE is_active = TRUE"
    );

    const [adminUsers] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    return res.json({
      total: totalUsers[0].count,
      active: activeUsers[0].count,
      admins: adminUsers[0].count,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
