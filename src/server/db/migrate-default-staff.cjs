/**
 * Migration: add default_staff_id column to services table
 */
const fs = require('fs'), path = require('path'), mysql = require('mysql2/promise');
const cfg = JSON.parse(fs.readFileSync(path.join(process.env.NOMAD_TASK_DIR || '/local', 'config.json'), 'utf8')).DATABASE.VALUE;

async function run() {
  const conn = await mysql.createConnection({
    host: cfg.HOST, port: parseInt(cfg.PORT),
    user: cfg.USERNAME, password: cfg.PASSWORD,
    database: cfg.NAME, ssl: { rejectUnauthorized: false },
  });

  // Add column if not exists
  const [cols] = await conn.execute(`SHOW COLUMNS FROM services LIKE 'default_staff_id'`);
  if (cols.length === 0) {
    await conn.execute(`ALTER TABLE services ADD COLUMN default_staff_id INT NULL REFERENCES staff(id)`);
    console.log('✅ Added default_staff_id column to services');
  } else {
    console.log('ℹ️  default_staff_id already exists');
  }

  // Show current state
  const [rows] = await conn.execute(`
    SELECT s.id, s.name, s.category, s.default_staff_id, st.name AS staff_name
    FROM services s
    LEFT JOIN staff st ON st.id = s.default_staff_id
    WHERE s.active = 1
    ORDER BY s.category, s.name
  `);
  console.log('\nCurrent services with default staff:');
  rows.forEach(r => console.log(`  [${r.category}] ${r.name} → ${r.staff_name ?? '(none)'}`));

  await conn.end();
}
run().catch(console.error);
