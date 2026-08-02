import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { env } from "@/config/env";

const connectionString = env.DB_URL || `postgresql://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT || 5432}/${env.DB_NAME}?schema=public`

const adapter = new PrismaPg({ connectionString });
const repository = new PrismaClient({ adapter, log: env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : [] });

export { repository };