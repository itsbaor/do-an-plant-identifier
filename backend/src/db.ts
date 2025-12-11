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
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`).catch(() => {});

    // Add role column to existing users table (migration)
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    `).catch(() => {
      // Ignore error if columns already exist
      console.log('Role columns may already exist, skipping...');
    });

    // Create articles table for Explore content
    await pool.query(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        author_id INT NOT NULL,
        is_published BOOLEAN DEFAULT FALSE,
        views INT DEFAULT 0,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_published (is_published, created_at),
        INDEX idx_category (category, is_published)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create plants table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        tree_like VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        water_level VARCHAR(50) NOT NULL,
        sun_level VARCHAR(50) NOT NULL,
        growth VARCHAR(50),
        category JSON,
        shared_with JSON,
        is_public BOOLEAN DEFAULT FALSE,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_plants (user_id, created_at),
        INDEX idx_plant_name (user_id, name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create reminders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plant_id INT,
        plant_name VARCHAR(255) NOT NULL,
        plant_image TEXT NOT NULL,
        task VARCHAR(50) NOT NULL,
        repeat_frequency VARCHAR(50) NOT NULL,
        time_repeat VARCHAR(20) NOT NULL,
        create_date DATETIME(6) NOT NULL,
        notification_channel_id VARCHAR(255) NOT NULL,
        device_tokens JSON,
        last_triggered_at DATETIME(6),
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE SET NULL,
        UNIQUE KEY unique_user_plant_task (user_id, plant_name, task),
        INDEX idx_user_reminders (user_id, is_active),
        INDEX idx_reminder_schedule (user_id, repeat_frequency, time_repeat)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Create default admin account if not exists
    await createDefaultAdmin(pool);
  }
  return pool;
}

// Create default admin account
async function createDefaultAdmin(pool: mysql.Pool) {
  try {
    const bcrypt = await import('bcrypt');

    // Check if admin exists
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      ['admin@plantidentifier.com']
    );

    if ((existing as any[]).length === 0) {
      // Create admin account
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      await pool.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Administrator', 'admin@plantidentifier.com', passwordHash, 'admin']
      );

      console.log('✅ Default admin account created:');
      console.log('   Email: admin@plantidentifier.com');
      console.log('   Password:', adminPassword);
      console.log('   ⚠️  Please change the password after first login!');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
}

export default { getPool };
