declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "dev" | "prd";
      PORT?: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER: string;
      DB_PASS: string;
      JWT_ACCESS_TOKEN_SECRET: string;
      JWT_REFRESH_TOKEN_SECRET: string;
    }
  }
}

export {};
