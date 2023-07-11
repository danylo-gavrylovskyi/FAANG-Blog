import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: Number(process.env.DBPORT),
  database: process.env.DBNAME,
});

export default pool;
