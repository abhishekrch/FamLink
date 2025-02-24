const { Pool } = require('pg');
require('dotenv').config({path: '../.env'});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false 
  }
});


const createUser = async (userData) => {
  const { name, email, password, type } = userData;
  const result = await pool.query(
    'INSERT INTO users (name, email, password, type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, type',
    [name, email, password, type]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email, type FROM users ORDER BY created_at DESC');
  return result.rows;
};

const searchUsers = async (searchTerm, typeFilter) => {
    let query = 'SELECT id, name, email, type FROM users';
    const params = [];
    let conditions = [];

    if (searchTerm) {
        params.push(`%${searchTerm}%`);
        conditions.push(`name ILIKE $${params.length}`); 
    }

    if (typeFilter) {
        params.push(typeFilter);
        conditions.push(`type = $${params.length}`);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC'; 
    const result = await pool.query(query, params);
    return result.rows;
};


module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  searchUsers,
};