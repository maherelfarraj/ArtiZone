/**
 * POST /api/admin/migrate
 * Additive migrations: creates/alters tables as needed.
 * Protected by SEQUENCE_SECRET.
 */
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../../../db/client.js';
import { getSecret } from '#airo/secrets';
import { sql } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const secret = req.headers['x-migrate-secret'] as string | undefined;
  const expected = getSecret('SEQUENCE_SECRET');
  if (!expected || secret !== expected) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const results: string[] = [];

  try {
    // ── Admin tables ──────────────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id                INT AUTO_INCREMENT PRIMARY KEY,
        name              VARCHAR(120) NOT NULL,
        email             VARCHAR(255) NOT NULL UNIQUE,
        password_hash     VARCHAR(255) NOT NULL,
        role              ENUM('superadmin','staff') NOT NULL DEFAULT 'staff',
        is_active         BOOLEAN NOT NULL DEFAULT TRUE,
        reset_token       VARCHAR(128),
        reset_token_expiry TIMESTAMP NULL,
        last_login_at     TIMESTAMP NULL,
        created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('admin_users: ok');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id         VARCHAR(128) PRIMARY KEY,
        user_id    INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users(id)
      )
    `);
    results.push('admin_sessions: ok');

    // ── Client portal tables ───────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS client_users (
        id                INT AUTO_INCREMENT PRIMARY KEY,
        full_name         VARCHAR(120) NOT NULL,
        phone             VARCHAR(40) NOT NULL,
        email             VARCHAR(255) NOT NULL UNIQUE,
        area              VARCHAR(120) NOT NULL,
        password_hash     VARCHAR(255),
        verified_at       TIMESTAMP NULL,
        loyalty_client_id INT,
        address           VARCHAR(500),
        dob               VARCHAR(20),
        created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('client_users: ok');

    // Add address + dob columns if they don't exist yet (idempotent)
    try {
      await db.execute(sql`ALTER TABLE client_users ADD COLUMN address VARCHAR(500)`);
      results.push('client_users.address: added');
    } catch { results.push('client_users.address: already exists'); }
    try {
      await db.execute(sql`ALTER TABLE client_users ADD COLUMN dob VARCHAR(20)`);
      results.push('client_users.dob: added');
    } catch { results.push('client_users.dob: already exists'); }

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS client_otp (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        email      VARCHAR(255) NOT NULL,
        code       VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used_at    TIMESTAMP NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_client_otp_email (email)
      )
    `);
    results.push('client_otp: ok');

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS client_sessions (
        id         VARCHAR(128) PRIMARY KEY,
        user_id    INT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES client_users(id)
      )
    `);
    results.push('client_sessions: ok');

    // ── Loyalty clients table ─────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS loyalty_clients (
        id                    INT AUTO_INCREMENT PRIMARY KEY,
        name                  VARCHAR(120) NOT NULL,
        phone                 VARCHAR(40) NOT NULL,
        email                 VARCHAR(255),
        visits                INT NOT NULL DEFAULT 0,
        free_sessions_earned  INT NOT NULL DEFAULT 0,
        free_sessions_used    INT NOT NULL DEFAULT 0,
        notes                 TEXT,
        points_balance        INT NOT NULL DEFAULT 0,
        tier                  VARCHAR(20) NOT NULL DEFAULT 'glow',
        points_earned_total   INT NOT NULL DEFAULT 0,
        points_redeemed_total INT NOT NULL DEFAULT 0,
        birthday              VARCHAR(10),
        date_of_birth         VARCHAR(10),
        address               VARCHAR(255),
        area                  VARCHAR(120),
        status                ENUM('active','inactive') NOT NULL DEFAULT 'active',
        skin_type             VARCHAR(40),
        created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('loyalty_clients: ok');

    // Additive columns for existing loyalty_clients table
    const lcCols = [
      `ALTER TABLE loyalty_clients ADD COLUMN date_of_birth VARCHAR(10)`,
      `ALTER TABLE loyalty_clients ADD COLUMN address VARCHAR(255)`,
      `ALTER TABLE loyalty_clients ADD COLUMN area VARCHAR(120)`,
      `ALTER TABLE loyalty_clients ADD COLUMN skin_type VARCHAR(40)`,
      `ALTER TABLE loyalty_clients ADD COLUMN points_balance INT NOT NULL DEFAULT 0`,
      `ALTER TABLE loyalty_clients ADD COLUMN tier VARCHAR(20) NOT NULL DEFAULT 'glow'`,
      `ALTER TABLE loyalty_clients ADD COLUMN points_earned_total INT NOT NULL DEFAULT 0`,
      `ALTER TABLE loyalty_clients ADD COLUMN points_redeemed_total INT NOT NULL DEFAULT 0`,
      `ALTER TABLE loyalty_clients ADD COLUMN birthday VARCHAR(10)`,
    ];
    for (const stmt of lcCols) {
      try { await db.execute(sql.raw(stmt)); results.push(`${stmt.split('ADD COLUMN ')[1]?.split(' ')[0]}: added`); }
      catch { results.push(`${stmt.split('ADD COLUMN ')[1]?.split(' ')[0]}: already exists`); }
    }
    // Fix tier default from legacy 'silver' to 'glow'
    try {
      await db.execute(sql.raw(`ALTER TABLE loyalty_clients MODIFY COLUMN tier VARCHAR(20) NOT NULL DEFAULT 'glow'`));
    } catch { /* ignore */ }
    // Add status column if missing
    try {
      await db.execute(sql.raw(`ALTER TABLE loyalty_clients ADD COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'`));
    } catch { /* already exists */ }
    results.push('loyalty_clients columns: ok');

    // ── Rename legacy tier values: radiant→silver, luminous→gold ─────────
    try {
      await db.execute(sql`UPDATE loyalty_clients SET tier = 'silver' WHERE tier = 'radiant'`);
      results.push('loyalty_clients tier rename radiant→silver: ok');
    } catch { results.push('loyalty_clients tier rename radiant→silver: skipped'); }
    try {
      await db.execute(sql`UPDATE loyalty_clients SET tier = 'gold' WHERE tier = 'luminous'`);
      results.push('loyalty_clients tier rename luminous→gold: ok');
    } catch { results.push('loyalty_clients tier rename luminous→gold: skipped'); }

    // ── Loyalty transactions ──────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        client_id   INT NOT NULL,
        type        VARCHAR(20) NOT NULL,
        points      INT NOT NULL,
        description VARCHAR(255),
        admin_by    VARCHAR(120),
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES loyalty_clients(id)
      )
    `);
    results.push('loyalty_transactions: ok');

    // Additive column for existing loyalty_transactions
    try {
      await db.execute(sql.raw(`ALTER TABLE loyalty_transactions ADD COLUMN IF NOT EXISTS admin_by VARCHAR(120)`));
    } catch { /* already exists */ }
    results.push('loyalty_transactions.admin_by: ok');

    // ── Loyalty visits ────────────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS loyalty_visits (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        client_id   INT NOT NULL,
        service     VARCHAR(120),
        is_free     BOOLEAN NOT NULL DEFAULT FALSE,
        admin_note  VARCHAR(255),
        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES loyalty_clients(id)
      )
    `);
    results.push('loyalty_visits: ok');

    // ── Loyalty sessions (new) ────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS loyalty_sessions (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        client_id    INT NOT NULL,
        session_date VARCHAR(20) NOT NULL,
        session_type VARCHAR(120) NOT NULL,
        status       ENUM('completed','pending','cancelled') NOT NULL DEFAULT 'pending',
        staff_name   VARCHAR(120),
        notes        TEXT,
        amount_paid  INT NOT NULL DEFAULT 0,
        created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES loyalty_clients(id)
      )
    `);
    results.push('loyalty_sessions: ok');

    // ── Seed / upsert superadmin ──────────────────────────────────────────
    const adminHash = await bcrypt.hash('Admin', 12);

    // Upsert superadmin — migrate old @artizone.com email if present and new one doesn't exist yet
    const existingNew = await db.execute(sql`SELECT id FROM admin_users WHERE email = 'info@artizonespa.com' LIMIT 1`);
    const existingNewRows = existingNew[0] as unknown as unknown[];
    if (existingNewRows.length === 0) {
      await db.execute(sql`UPDATE admin_users SET email = 'info@artizonespa.com' WHERE email = 'info@artizone.com'`);
    }
    await db.execute(sql`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES ('ArtiZone Admin', 'info@artizonespa.com', ${adminHash}, 'superadmin')
      ON DUPLICATE KEY UPDATE
        password_hash = ${adminHash},
        role = 'superadmin',
        is_active = TRUE
    `);
    results.push('superadmin: upserted');

    // ── booking_requests new columns ──────────────────────────────────────
    try {
      await db.execute(sql`ALTER TABLE booking_requests ADD COLUMN admin_notes TEXT`);
      results.push('booking_requests.admin_notes: added');
    } catch { results.push('booking_requests.admin_notes: already exists'); }

    try {
      await db.execute(sql`ALTER TABLE booking_requests ADD COLUMN source VARCHAR(40) NOT NULL DEFAULT 'web_form'`);
      results.push('booking_requests.source: added');
    } catch { results.push('booking_requests.source: already exists'); }

    try {
      await db.execute(sql`ALTER TABLE booking_requests ADD COLUMN confirmed_at TIMESTAMP NULL`);
      results.push('booking_requests.confirmed_at: added');
    } catch { results.push('booking_requests.confirmed_at: already exists'); }

    try {
      await db.execute(sql`ALTER TABLE booking_requests ADD COLUMN no_show_at TIMESTAMP NULL`);
      results.push('booking_requests.no_show_at: added');
    } catch { results.push('booking_requests.no_show_at: already exists'); }

    // Extend status enum to include no_show and declined
    try {
      await db.execute(sql`ALTER TABLE booking_requests MODIFY COLUMN status ENUM('pending','confirmed','cancelled','no_show','declined') NOT NULL DEFAULT 'pending'`);
      results.push('booking_requests.status: enum extended');
    } catch { results.push('booking_requests.status: enum already extended'); }

    // ── Seed staff users 1–5 ─────────────────────────────────────────────
    const staffHash = await bcrypt.hash('Admin', 12);
    const staffUsers = [
      { name: 'User1', email: 'user1@artizonespa.com', old: 'user1@artizone.com' },
      { name: 'User2', email: 'user2@artizonespa.com', old: 'user2@artizone.com' },
      { name: 'User3', email: 'user3@artizonespa.com', old: 'user3@artizone.com' },
      { name: 'User4', email: 'user4@artizonespa.com', old: 'user4@artizone.com' },
      { name: 'User5', email: 'user5@artizonespa.com', old: 'user5@artizone.com' },
    ];

    for (const u of staffUsers) {
      // Migrate old @artizone.com email only if new one doesn't already exist
      const existingStaffNew = await db.execute(sql`SELECT id FROM admin_users WHERE email = ${u.email} LIMIT 1`);
      const existingStaffRows = existingStaffNew[0] as unknown as unknown[];
      if (existingStaffRows.length === 0) {
        await db.execute(sql`UPDATE admin_users SET email = ${u.email} WHERE email = ${u.old}`);
      }
      await db.execute(sql`
        INSERT INTO admin_users (name, email, password_hash, role)
        VALUES (${u.name}, ${u.email}, ${staffHash}, 'staff')
        ON DUPLICATE KEY UPDATE
          name = ${u.name},
          password_hash = ${staffHash},
          is_active = TRUE
      `);
      results.push(`${u.name}: seeded`);
    }

    // ── Customers (normalised) ────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customers (
        id                INT AUTO_INCREMENT PRIMARY KEY,
        name              VARCHAR(120) NOT NULL,
        phone             VARCHAR(40) NOT NULL,
        email             VARCHAR(255),
        area              VARCHAR(120),
        dob               VARCHAR(10),
        notes             TEXT,
        loyalty_client_id INT,
        created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_customers_phone (phone)
      )
    `);
    results.push('customers: ok');

    // ── Packages catalogue ────────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS packages (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        name            VARCHAR(255) NOT NULL,
        description     TEXT,
        category        VARCHAR(40) NOT NULL DEFAULT 'other',
        total_sessions  INT NOT NULL,
        price_jod       INT NOT NULL DEFAULT 0,
        service_id      INT,
        validity_days   INT NOT NULL DEFAULT 0,
        active          BOOLEAN NOT NULL DEFAULT TRUE,
        created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    results.push('packages: ok');

    // ── Customer packages (purchased bundles) ─────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS customer_packages (
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
      )
    `);
    results.push('customer_packages: ok');

    // ── Package redemptions ───────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS package_redemptions (
        id                   INT AUTO_INCREMENT PRIMARY KEY,
        customer_package_id  INT NOT NULL,
        appointment_id       INT,
        redeemed_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        redeemed_by          VARCHAR(120),
        notes                VARCHAR(255),
        FOREIGN KEY (customer_package_id) REFERENCES customer_packages(id),
        INDEX idx_pr_cp (customer_package_id)
      )
    `);
    results.push('package_redemptions: ok');

    // ── Waitlist ──────────────────────────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        customer_name   VARCHAR(120) NOT NULL,
        customer_phone  VARCHAR(40) NOT NULL,
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
      )
    `);
    results.push('waitlist: ok');

    // ── Notifications (deduplication log) ─────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        type         VARCHAR(80) NOT NULL,
        reference_id INT NOT NULL,
        channel      VARCHAR(20) NOT NULL DEFAULT 'email',
        recipient    VARCHAR(255),
        sent_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status_code  INT,
        created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_notification (type, reference_id, channel)
      )
    `);
    results.push('notifications: ok');

    // ── Demo client account ────────────────────────────────────────────────
    const demoClientEmail = 'demo@artizonespa.com';
    const existingDemo = await db.execute(sql`SELECT id FROM client_users WHERE email = ${demoClientEmail} LIMIT 1`);
    const demoRows = (existingDemo as any)[0] as any[];
    if (!demoRows || demoRows.length === 0) {
      const demoHash = await bcrypt.hash('Demo1234', 10);
      await db.execute(sql`
        INSERT INTO client_users (full_name, phone, email, area, password_hash, verified_at)
        VALUES ('Sara Al Ahmad', '+962791234567', ${demoClientEmail}, 'Abdoun, Amman', ${demoHash}, NOW())
      `);
      results.push('demo client account: created');
    } else {
      results.push('demo client account: already exists');
    }

    return res.json({
      ok: true,
      message: 'Migration complete. All tables created/updated. Admin and staff users seeded.',
      results,
      credentials: {
        admin: { email: 'info@artizone.com', password: 'Admin', role: 'superadmin' },
        staff: staffUsers.map(u => ({ email: u.email, password: 'Admin', role: 'staff' })),
        demoClient: { email: demoClientEmail, role: 'client' },
      },
    });
  } catch (err) {
    console.error('admin.migrate.error', err);
    return res.status(500).json({ error: String(err), results });
  }
}
