import pg from 'pg';
import { config } from '../config/wawita.config.js';

const { host, port, user, password, database } = config.db;

const pool = new pg.Pool({
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,
  allowExitOnIdle: true,
});

pool.query('SELECT current_database(), NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    const { current_database, now } = res.rows[0];
    console.info(
      `Database connected successfully: ${current_database} at ${now}`
    );
  }
});

export default pool;
