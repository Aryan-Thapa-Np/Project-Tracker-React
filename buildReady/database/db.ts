import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ quiet: true });

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // DB host
  user: process.env.DB_USER,       // DB user
  password: process.env.DB_PASSWORD, // DB password
  database: process.env.DB_NAME,     // DB name
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,             // max concurrent connections
  queueLimit: 0,
});

// Test connection
export const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    if (connection) connection.release(); // release the connection back to pool
  }
};



export default pool;
