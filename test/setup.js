import { config } from '../config/wawita.config.js';
import { pool } from '../db/config.db.js';

afterAll(async () => {
  await pool.end();
});

if (config.server.env === 'test') {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
}
