import { Pool, PoolConfig } from "pg";
import { types } from "pg";

import { env } from "@/config/env";

const connectionData: PoolConfig = env.DB_URL
  ? { connectionString: env.DB_URL }
  : {
    database: env.DB_NAME || "postgres",
    host: env.DB_HOST || "localhost",
    password: env.DB_PASSWORD || "root",
    port: env.DB_PORT || 5432,
    user: env.DB_USER || "postgres",
  };

const pool = new Pool(connectionData);

// this is for int8 or 64bits integer problem in js
types.setTypeParser(20, (val) => parseInt(val, 10));

const testConnection = async () => {
  try {
    const value = await pool.query("SELECT true as test")
    console.log("Successfully connect to Database: ", value.rows[0])
    return value
  } catch (error) {
    console.log(error)
  }
}
testConnection().then((e) => { console.log(e) }).catch((e: unknown) => { console.log(e) })
export default pool;
