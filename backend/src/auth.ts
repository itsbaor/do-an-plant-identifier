// src/auth.ts
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";
import db from "./db";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

/** Kiểu row trả về từ MySQL */
type UserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

/** Tạo JWT với thời hạn tuỳ theo remember */
function signToken(payload: object, remember = false) {
  const secret = (process.env.JWT_SECRET ?? "") as Secret;
  if (!secret) throw new Error("Missing JWT_SECRET");

  const longExp = (process.env.TOKEN_EXPIRES_LONG ?? "30d") as StringValue;
  const shortExp = (process.env.TOKEN_EXPIRES_SHORT ?? "1d") as StringValue;

  const expiresIn: SignOptions["expiresIn"] = remember ? longExp : shortExp;
  return jwt.sign(payload, secret, { expiresIn });
}

/** POST /api/auth/register  { name, email, password } */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Thiếu name/email/password" });
    }
    if (!/[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)) {
      return res.status(400).json({ error: "Email không hợp lệ" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Mật khẩu tối thiểu 8 ký tự" });
    }

    const pool = await db.getPool();

    // Kiểm tra tồn tại email
    const [exists] = await pool.execute<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    if (exists.length > 0) {
      return res.status(409).json({ error: "Email đã tồn tại" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Insert user
    const [ins] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hash]
    );

    return res.json({
      message: "Đăng ký thành công",
      // id mới nếu cần: (ins as ResultSetHeader).insertId
      id: ins.insertId,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

/** POST /api/auth/login  { email, password, remember } */
router.post("/login", async (req, res) => {
  try {
    const { email, password, remember } = req.body as {
      email?: string;
      password?: string;
      remember?: boolean;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Thiếu email/password" });
    }

    const pool = await db.getPool();

    // Lấy user theo email
    const [rows] = await pool.execute<UserRow[]>(
      "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
    }

    // So khớp mật khẩu
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
    }

    // Tạo token
    const token = signToken({ sub: user.id, email: user.email }, !!remember);

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
});

export default router;
