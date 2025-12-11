import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import db from "../db";
import type { RowDataPacket } from "mysql2";

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
  userRole?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.substring(7);
    const secret = (process.env.JWT_SECRET ?? "") as Secret;

    if (!secret) {
      console.error("JWT_SECRET not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret);

    // Type guard to ensure decoded is an object with required properties
    if (typeof decoded === 'object' && decoded !== null && 'sub' in decoded && 'email' in decoded) {
      // Extract and validate the properties
      const sub = decoded.sub;
      const email = decoded.email;

      // Convert sub to number if it's a string, or use it directly if it's already a number
      const userId = typeof sub === 'string' ? parseInt(sub, 10) : typeof sub === 'number' ? sub : null;

      if (userId === null || isNaN(userId) || typeof email !== 'string') {
        return res.status(401).json({ error: "Invalid token payload" });
      }

      req.userId = userId;
      req.userEmail = email;
      next();
    } else {
      return res.status(401).json({ error: "Invalid token payload" });
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
}

/**
 * Admin middleware - checks if user has admin role
 * Must be used AFTER authMiddleware
 */
export async function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const pool = await db.getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT role FROM users WHERE id = ? LIMIT 1",
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userRole = rows[0].role;
    req.userRole = userRole;

    if (userRole !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ error: "Authorization check failed" });
  }
}
