import * as dotenv from "dotenv";

dotenv.config();

type configType = {
  APP: {
    PORT: number;
    NODE_ENV: string;
    SECRET: string;
    SESSION_TIMEOUT: string;
  };
  DB: {
    host: string;
    user: string;
    password: string;
    port: number;
    database: string;
  };
};

const config: configType = {
  APP: {
    PORT: Number(process.env.APP_PORT),
    NODE_ENV: process.env.NODE_ENV,
    SECRET: process.env.TOKEN_SECRET,
    SESSION_TIMEOUT: process.env.TOKEN_SESSION_TIMEOUT,
  },
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
};

export default config;
