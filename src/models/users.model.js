import format from 'pg-format';
import { config } from '../../config/wawita.config.js';
import pool from '../../db/config.db.js';

const create = async (user) => {
  const { name: table } = config.db.tables.users;
  const { email, hashedPassword } = user;

  const query = format(
    'INSERT INTO %I (email, password_hash) VALUES (%L, %L) RETURNING *',
    table,
    email,
    hashedPassword
  );
  console.info(`Executing query: ${query}`);

  const { rows } = await pool.query(query);
  return rows[0];
};

const findByEmail = async (email) => {
  const { name: table } = config.db.tables.users;

  const query = format(
    `SELECT 
      u.id, 
      u.email,
      u.password_hash,
      up.id AS profile_id
    FROM %I u
    JOIN user_profiles up ON u.id = up.user_id 
    WHERE email = %L`,
    table,
    email
  );
  console.info(`Executing query: ${query}`);

  const { rows } = await pool.query(query);
  return rows[0];
};

export default { create, findByEmail };
