/**
 * Migration: create admin_users + admin_sessions tables and seed first superadmin.
 * Run once: node src/server/db/migrate-admin-auth.cjs
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function run() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'artizone',
    ssl: { rejectUnauthorized: false },
  });

  console.log('Connected. Running migration…');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id               INT AUTO_INCREMENT PRIMARY KEY,
      name             VARCHAR(120) NOT NULL,
      email            VARCHAR(255) NOT NULL UNIQUE,
      password_hash    VARCHAR(255) NOT NULL,
      role             ENUM('superadmin','staff') NOT NULL DEFAULT 'staff',
      is_active        BOOLEAN NOT NULL DEFAULT TRUE,
      reset_token      VARCHAR(128),
      reset_token_expiry TIMESTAMP NULL,
      last_login_at    TIMESTAMP NULL,
      created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ admin_users table ready');

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id         VARCHAR(128) PRIMARY KEY,
      user_id    INT NOT NULL REFERENCES admin_users(id),
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ admin_sessions table ready');

  // Seed superadmin if none exists
  const [rows] = await conn.execute('SELECT id FROM admin_users WHERE role = "superadmin" LIMIT 1');
  if (rows.length === 0) {
    const password = crypto.randomBytes(8).toString('hex'); // 16-char random
    const hash = await bcrypt.hash(password, 12);
    await conn.execute(
      'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['ArtiZone Admin', 'info@artizonespa.com', hash, 'superadmin']
    );
    console.log('\n✅ Superadmin created!');
    console.log('   Email:    info@artizonespa.com');
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  Save this password — it will not be shown again.\n');
  } else {
    console.log('✓ Superadmin already exists — skipping seed');
  }

  await conn.end();
  console.log('Migration complete.');
}

run().catch(err => { console.error(err); process.exit(1); });
