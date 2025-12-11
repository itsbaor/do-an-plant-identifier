import { Router } from "express";
import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { authMiddleware, AuthRequest } from "./middleware/auth";

const router = Router();
router.use(authMiddleware);

type ReminderRow = RowDataPacket & {
  id: number;
  user_id: number;
  plant_id?: number;
  plant_name: string;
  plant_image: string;
  task: string;
  repeat_frequency: string;
  time_repeat: string;
  create_date: Date;
  notification_channel_id: string;
  device_tokens?: string;
  is_active: boolean;
  created_at: Date;
};

// GET /api/reminders - Fetch all active reminders
router.get("/", async (req: AuthRequest, res) => {
  try {
    const pool = await db.getPool();
    const [rows] = await pool.execute<ReminderRow[]>(
      "SELECT * FROM reminders WHERE user_id = ? AND is_active = TRUE ORDER BY created_at DESC",
      [req.userId]
    );

    const reminders = rows.map((row) => ({
      ...row,
      device_tokens: row.device_tokens ? JSON.parse(row.device_tokens) : [],
    }));

    return res.json({ reminders });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Helper function to convert ISO string to MySQL datetime
function toMySQLDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// POST /api/reminders - Create new reminder
router.post("/", async (req: AuthRequest, res) => {
  try {
    const {
      plantName,
      plantImage,
      task,
      repeat,
      timeRepeate,
      createDate,
      deviceToken,
    } = req.body;

    if (!plantName || !task || !repeat || !timeRepeate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const pool = await db.getPool();

    // Check for duplicate reminder
    const [existing] = await pool.execute<ReminderRow[]>(
      "SELECT id FROM reminders WHERE user_id = ? AND plant_name = ? AND task = ? LIMIT 1",
      [req.userId, plantName, task]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Reminder already exists for this plant and task" });
    }

    // Get plant_id if exists
    const [plantRows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM plants WHERE user_id = ? AND name = ? LIMIT 1",
      [req.userId, plantName]
    );
    const plantId = plantRows.length > 0 ? plantRows[0].id : null;

    // Generate unique notification channel ID with userId to avoid conflicts
    const notificationChannelId = `${task}_${plantName}_${req.userId}`;

    const deviceTokens = deviceToken ? [deviceToken] : [];

    // Convert createDate to MySQL datetime format
    const mysqlCreateDate = createDate
      ? toMySQLDateTime(createDate)
      : toMySQLDateTime(new Date().toISOString());

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO reminders
       (user_id, plant_id, plant_name, plant_image, task, repeat_frequency, time_repeat, create_date, notification_channel_id, device_tokens)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        plantId,
        plantName,
        plantImage,
        task,
        repeat,
        timeRepeate,
        mysqlCreateDate,
        notificationChannelId,
        JSON.stringify(deviceTokens),
      ]
    );

    return res.status(201).json({
      message: "Reminder created successfully",
      reminderId: result.insertId,
      notificationChannelId,
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/reminders/:plantName/:task - Remove specific reminder
router.delete("/:plantName/:task", async (req: AuthRequest, res) => {
  try {
    const { plantName, task } = req.params;
    const pool = await db.getPool();

    // Get notification channel ID before deleting
    const [rows] = await pool.execute<ReminderRow[]>(
      "SELECT notification_channel_id FROM reminders WHERE user_id = ? AND plant_name = ? AND task = ? LIMIT 1",
      [req.userId, plantName, task]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    const notificationChannelId = rows[0].notification_channel_id;

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM reminders WHERE user_id = ? AND plant_name = ? AND task = ?",
      [req.userId, plantName, task]
    );

    return res.json({
      message: "Reminder removed successfully",
      notificationChannelId,
    });
  } catch (error) {
    console.error("Error removing reminder:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/reminders/bulk - Bulk upload reminders (for migration)
router.post("/bulk", async (req: AuthRequest, res) => {
  try {
    const { reminders } = req.body;

    if (!Array.isArray(reminders) || reminders.length === 0) {
      return res.status(400).json({ error: "Invalid reminders array" });
    }

    const pool = await db.getPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let inserted = 0;
      let skipped = 0;

      for (const reminder of reminders) {
        const { plantName, plantImage, task, repeat, timeRepeate, createDate } =
          reminder;

        // Check for duplicates
        const [existing] = await connection.execute<ReminderRow[]>(
          "SELECT id FROM reminders WHERE user_id = ? AND plant_name = ? AND task = ? LIMIT 1",
          [req.userId, plantName, task]
        );

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Get plant_id
        const [plantRows] = await connection.execute<RowDataPacket[]>(
          "SELECT id FROM plants WHERE user_id = ? AND name = ? LIMIT 1",
          [req.userId, plantName]
        );
        const plantId = plantRows.length > 0 ? plantRows[0].id : null;

        const notificationChannelId = `${task}_${plantName}_${req.userId}`;

        // Convert createDate to MySQL datetime format
        const mysqlCreateDate = createDate
          ? toMySQLDateTime(createDate)
          : toMySQLDateTime(new Date().toISOString());

        await connection.execute(
          `INSERT INTO reminders
           (user_id, plant_id, plant_name, plant_image, task, repeat_frequency, time_repeat, create_date, notification_channel_id, device_tokens)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.userId,
            plantId,
            plantName,
            plantImage,
            task,
            repeat,
            timeRepeate,
            mysqlCreateDate,
            notificationChannelId,
            JSON.stringify([]),
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
    console.error("Error bulk uploading reminders:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/reminders/:id/device-token - Add device token for notifications
router.put("/:id/device-token", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { deviceToken } = req.body;

    if (!deviceToken) {
      return res.status(400).json({ error: "Device token required" });
    }

    const pool = await db.getPool();

    // Get current device tokens
    const [rows] = await pool.execute<ReminderRow[]>(
      "SELECT device_tokens FROM reminders WHERE id = ? AND user_id = ? LIMIT 1",
      [id, req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }

    const currentTokens = rows[0].device_tokens
      ? JSON.parse(rows[0].device_tokens)
      : [];

    // Add token if not already present
    if (!currentTokens.includes(deviceToken)) {
      currentTokens.push(deviceToken);

      await pool.execute(
        "UPDATE reminders SET device_tokens = ? WHERE id = ? AND user_id = ?",
        [JSON.stringify(currentTokens), id, req.userId]
      );
    }

    return res.json({ message: "Device token added successfully" });
  } catch (error) {
    console.error("Error adding device token:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
