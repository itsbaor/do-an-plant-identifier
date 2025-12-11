import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth";
import plantsRouter from "./plants";
import remindersRouter from "./reminders";
import db from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "Plant Auth API (MySQL)" }));

app.use("/api/auth", authRouter);
app.use("/api/plants", plantsRouter);
app.use("/api/reminders", remindersRouter);

const port = Number(process.env.PORT || 3000);

(async () => {
  try {
    await db.getPool(); // tạo DB & bảng nếu chưa có
    app.listen(port, () => {
      console.log(`Auth API listening on http://localhost:${port}`);
    });
  } catch (e) {
    console.error("Failed to init DB:", e);
    process.exit(1);
  }
})();
