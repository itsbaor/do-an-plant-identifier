import dotenv from "dotenv";
import mysql from "mysql2/promise";
dotenv.config();

const {
  MYSQL_HOST = "localhost",
  MYSQL_PORT = "3306",
  MYSQL_DB = "plant_auth",
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
} = process.env;

let pool: mysql.Pool;

export async function getPool() {
  if (!pool) {
    // Tạo pool tới "server" (chưa chắc DB đã tồn tại)
    const serverPool = mysql.createPool({
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Tạo DB nếu chưa có
    await serverPool.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

    // Tạo pool gắn với DB cụ thể
    pool = mysql.createPool({
      host: MYSQL_HOST,
      port: Number(MYSQL_PORT),
      user: MYSQL_USER,
      password: MYSQL_PASSWORD,
      database: MYSQL_DB,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Tạo bảng nếu chưa có
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(320) NOT NULL UNIQUE,
        password_hash VARCHAR(200) NOT NULL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`).catch(() => {});
  }
  return pool;
}

export default { getPool };
