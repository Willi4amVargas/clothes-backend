import { Pool } from "pg";
import { env } from "@/config/env";

const pool = new Pool({
  user: env.DB_USER || "postgres",
  host: env.DB_HOST || "localhost",
  database: env.DB_NAME || "postgres",
  password: env.DB_PASSWORD || "root",
  port: env.DB_PORT || 5432,
});

export default pool;
