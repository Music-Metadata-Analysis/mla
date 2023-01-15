type envType = typeof process.env;

export interface MutableEnv extends envType {
  NODE_ENV: "development" | "production" | "test";
}
