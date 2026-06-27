/**
 * Migration: create customers, packages, customer_packages,
 * package_redemptions, waitlist, notifications tables.
 * Run: node src/server/db/migrate-new-tables.cjs
 */
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function getDbConfig() {
  const configPath = path.join(process.env.NOMAD_TASK_DIR || '/local', 'config.json');
  const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const db  = cfg.DATABASE.VALUE;
  return { host: db.HOST, port: parseInt(db.PORT), user: db.USERNAME, password: db.PASSWORD, database: db.NAME };
}

async function run() {
  const creds = await getDbConfig();
  const conn  = await mysql.createConnection({ ...creds, ssl: { rejectUnauthorized: false } });
  console.log('Connected to', creds.database, '@', creds.host);

  const tables = [
    // ── customers ──────────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS customers (
      id                INT AUTO_INCREMENT PRIMARY KEY,
      name              VARCHAR(120) NOT NULL,
      phone             VARCHAR(40)  NOT NULL,
      email             VARCHAR(255),
      area              VARCHAR(120),
      dob               VARCHAR(10),
      notes             TEXT,
      loyalty_client_id INT,
      created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_customers_phone (phone)
    )`,

    // ── packages ───────────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS packages (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(255) NOT NULL,
      description     TEXT,
      category        VARCHAR(40)  NOT NULL DEFAULT 'other',
      total_sessions  INT          NOT NULL,
      price_jod       INT          NOT NULL DEFAULT 0,
      service_id      INT,
      validity_days   INT          NOT NULL DEFAULT 0,
      active          BOOLEAN      NOT NULL DEFAULT TRUE,
      created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // ── customer_packages ──────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS customer_packages (
      id                  INT AUTO_INCREMENT PRIMARY KEY,
      customer_id         INT NOT NULL,
      package_id          INT NOT NULL,
      package_name        VARCHAR(255) NOT NULL,
      total_sessions      INT NOT NULL,
      sessions_remaining  INT NOT NULL,
      price_paid_jod      INT NOT NULL DEFAULT 0,
      purchased_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      expires_at          TIMESTAMP NULL,
      status              ENUM('active','completed','expired','cancelled') NOT NULL DEFAULT 'active',
      sold_by             VARCHAR(120),
      notes               TEXT,
      created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (package_id)  REFERENCES packages(id),
      INDEX idx_cp_customer (customer_id),
      INDEX idx_cp_status   (status)
    )`,

    // ── package_redemptions ────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS package_redemptions (
      id                   INT AUTO_INCREMENT PRIMARY KEY,
      customer_package_id  INT NOT NULL,
      appointment_id       INT,
      redeemed_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      redeemed_by          VARCHAR(120),
      notes                VARCHAR(255),
      FOREIGN KEY (customer_package_id) REFERENCES customer_packages(id),
      INDEX idx_pr_cp (customer_package_id)
    )`,

    // ── waitlist ───────────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS waitlist (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      customer_name   VARCHAR(120) NOT NULL,
      customer_phone  VARCHAR(40)  NOT NULL,
      customer_email  VARCHAR(255),
      service_id      INT,
      service_name    VARCHAR(255),
      preferred_date  VARCHAR(20),
      preferred_time  VARCHAR(8),
      staff_id        INT,
      status          ENUM('waiting','offered','booked','expired','cancelled') NOT NULL DEFAULT 'waiting',
      offered_at      TIMESTAMP NULL,
      notes           TEXT,
      source          VARCHAR(40) NOT NULL DEFAULT 'web_form',
      created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_waitlist_status (status),
      INDEX idx_waitlist_phone  (customer_phone)
    )`,

    // ── notifications ──────────────────────────────────────────────────────
    `CREATE TABLE IF NOT EXISTS notifications (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      type         VARCHAR(80)  NOT NULL,
      reference_id INT          NOT NULL,
      channel      VARCHAR(20)  NOT NULL DEFAULT 'email',
      recipient    VARCHAR(255),
      sent_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      status_code  INT,
      created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_notification (type, reference_id, channel)
    )`,
  ];

  for (const sql of tables) {
    const tableName = (sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/) || [])[1];
    try {
      await conn.execute(sql);
      console.log(`✓ ${tableName}`);
    } catch (err) {
      console.error(`✗ ${tableName}:`, err.message);
    }
  }

  await conn.end();
  console.log('\nMigration complete.');
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
