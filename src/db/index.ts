import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({ connectionString: config.connection_string });

export const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT,
        role  VARCHAR(200),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW()
        )
   `);
  console.log("Databse Connection Successful");
};
