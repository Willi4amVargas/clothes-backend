interface IEnvirontmentVariables {
  HOST: string;
  PORT: number;
  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_URL: string;
  JWT_SECRET: string;
  MAIL_FROM: string;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_USERNAME: string;
  MAIL_PASSWORD: string;
  MAIL_ENCRYPTION: string;
}

export const env: IEnvirontmentVariables =
  process.env as unknown as IEnvirontmentVariables;
