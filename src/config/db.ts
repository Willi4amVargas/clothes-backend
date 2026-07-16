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

const testConnection = async (): Promise<boolean | undefined> => {
  try {
    const value = await pool.query("SELECT true as test");
    return value.rows[0].test;
  } catch (error) {
    console.log(error);
  }
};
testConnection()
  .then((e) => {
    if (typeof e === "boolean") {
      console.log("Successfully connect to database", e);
    } else {
      console.log("Query executed but don't return a boolean", e);
    }
  })
  .catch((e: unknown) => {
    console.log(e);
  });
export default pool;
