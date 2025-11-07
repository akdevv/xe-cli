declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DEBUG?: string;
      NODE_ENV: "development" | "production" | "test";
    }
  }
}

export {};
