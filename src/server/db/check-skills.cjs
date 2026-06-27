const fs = require('fs'), path = require('path'), mysql = require('mysql2/promise');
const cfg = JSON.parse(fs.readFileSync(path.join(process.env.NOMAD_TASK_DIR || '/local', 'config.json'), 'utf8')).DATABASE.VALUE;
async function run() {
  const conn = await mysql.createConnection({ host: cfg.HOST, port: parseInt(cfg.PORT), user: cfg.USERNAME, password: cfg.PASSWORD, database: cfg.NAME, ssl: { rejectUnauthorized: false } });
  const [staff]    = await conn.execute('SELECT id, name, role FROM staff WHERE active=1 ORDER BY id');
  const [skills]   = await conn.execute('SELECT staff_id, skill FROM staff_skills ORDER BY staff_id');
  const [services] = await conn.execute('SELECT id, name, category, duration_min, price FROM services WHERE active=1 ORDER BY category, name');
  const [packages] = await conn.execute('SELECT id, name, category, total_sessions, price_jod, service_id FROM packages ORDER BY id');
  console.log('STAFF:'   , JSON.stringify(staff));
  console.log('SKILLS:'  , JSON.stringify(skills));
  console.log('SERVICES:', JSON.stringify(services));
  console.log('PACKAGES:', JSON.stringify(packages));
  await conn.end();
}
run().catch(console.error);
