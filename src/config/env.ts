interface IEnvirontmentVariables {
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
  PORT: number;
}

export const env: IEnvirontmentVariables =
  process.env as unknown as IEnvirontmentVariables;
