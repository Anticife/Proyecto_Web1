const fs = require('fs');
function loadEnv() {
  const e = {};
  if (fs.existsSync('.env')) {
    fs.readFileSync('.env','utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (m) e[m[1]] = m[2];
    });
  }
  return e;
}
(async () => {
  const env = loadEnv();
  const connectionString = env.DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('NO_DATABASE_URL');
    process.exit(2);
  }
  const { Client } = require('pg');
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;");
    console.log('TABLES:', res.rows.map(r => r.tablename));
    await client.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
