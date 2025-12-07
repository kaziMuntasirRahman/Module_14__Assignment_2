import { Pool } from "pg";
import config from ".";

const pool = new Pool({
  connectionString: config.neon_conn_str,
});

export const initDB = async () => {
  await pool.query(`
         CREATE TABLE IF NOT EXISTS users(
         id SERIAL PRIMARY KEY,
         name VARCHAR(50) NOT NULL,
         email VARCHAR(50) NOT NULL UNIQUE,
         password TEXT NOT NULL,
         phone VARCHAR(15) NOT NULL,
         role VARCHAR(10) DEFAULT 'customer'
         )
      `);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(200) NOT NULL,
      type VARCHAR(5),
      registration_number INTEGER NOT NULL UNIQUE,
      daily_rent_price INTEGER NOT NULL,
      availability_status VARCHAR(10)
      )
      `);
};

export default pool;
