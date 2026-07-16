import { createClient } from "redis";

import { env } from "@/config/env";

const { REDIS_DB, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } =
  env;

export const redisClient = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  console.log("Conectando a Redis...");
});

redisClient.on("ready", () => {
  console.log("Successfully connect to redis database");
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Error crítico al conectar a REDIS:", error);
    process.exit(1);
  }
};

connectRedis();
