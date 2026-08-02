import dotenv from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;

dotenv.config({ path: envFile });

export interface IEnvironmentVariables {
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_URL: string;
  DB_USER: string;
  HOST: string;
  JWT_SECRET: string;
  MAIL_ENCRYPTION: string;
  MAIL_FROM: string;
  MAIL_HOST: string;
  MAIL_PASSWORD: string;
  MAIL_PORT: number;
  MAIL_USERNAME: string;
  NODE_ENV: string;
  PORT: number;
  REDIS_DB: string;
  REDIS_HOST: string;
  REDIS_PASSWORD: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
}

export const env = process.env as unknown as IEnvironmentVariables;