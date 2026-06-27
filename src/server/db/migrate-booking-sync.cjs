/**
 * Migration: add booking_request_id column to appointments table.
 * Run: node src/server/db/migrate-booking-sync.cjs
 */
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function run() {
  const cfg = JSON.parse(fs.readFileSync(
    path.join(process.env.NOMAD_TASK_DIR || '/local', 'config.json'), 'utf8'
  )).DATABASE.VALUE;

  const conn = await mysql.createConnection({
    host: cfg.HOST, port: parseInt(cfg.PORT),
    user: cfg.USERNAME, password: cfg.PASSWORD,
    database: cfg.NAME, ssl: { rejectUnauthorized: false },
  });
  console.log('Connected to', cfg.NAME);

  // Add booking_request_id column
  try {
    await conn.execute(
      `ALTER TABLE appointments ADD COLUMN booking_request_id INT NULL AFTER source`
    );
    console.log('✓ booking_request_id column added');
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') console.log('✓ booking_request_id already exists');
    else throw e;
  }

  // Add index
  try {
    await conn.execute(
      `ALTER TABLE appointments ADD INDEX idx_appt_booking_req (booking_request_id)`
    );
    console.log('✓ index added');
  } catch (e) {
    if (e.code === 'ER_DUP_KEYNAME') console.log('✓ index already exists');
    else console.log('index skip:', e.message);
  }

  await conn.end();
  console.log('Migration complete.');
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
