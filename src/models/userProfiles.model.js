import format from 'pg-format';
import { config } from '../../config/wawita.config.js';
import pool from '../../db/config.db.js';

const create = async (userProfile) => {
  const { name: table } = config.db.tables.userProfiles;
  const { userId, fullname } = userProfile;

  const query = format(
    'INSERT INTO %I (user_id, fullname) VALUES (%L, %L) RETURNING *',
    table,
    userId,
    fullname
  );
  console.info(`Executing query: ${query}`);

  const { rows } = await pool.query(query);
  return rows[0];
};

const findById = async (id) => {
  const { name: table } = config.db.tables.userProfiles;

  const query = format(
    `SELECT 
      up.id,
      up.fullname,
      u.email,
      up.nickname,
      up.avatar_url,
      up.biography
    FROM %I up 
    JOIN users u ON up.user_id = u.id
    WHERE up.id = %L`,
    table,
    id
  );
  console.info(`Executing query: ${query}`);

  const { rows } = await pool.query(query);
  return rows[0];
};

export default { create, findById };
