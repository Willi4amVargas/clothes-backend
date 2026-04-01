interface IEnvirontmentVariables {
  HOST: string;
  PORT: number;
  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  JWT_SECRET: string;
}

export const env: IEnvirontmentVariables =
  process.env as unknown as IEnvirontmentVariables;
