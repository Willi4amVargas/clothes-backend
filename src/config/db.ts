import { Pool } from "pg";
import { types } from "pg";
import { env } from "@/config/env";

const pool = new Pool({
  user: env.DB_USER || "postgres",
  host: env.DB_HOST || "localhost",
  database: env.DB_NAME || "postgres",
  password: env.DB_PASSWORD || "root",
  port: env.DB_PORT || 5432,
});

// this is for int8 or 64bits integer problem in js
types.setTypeParser(20, (val) => parseInt(val, 10));

export default pool;
