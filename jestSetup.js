import { loadEnvConfig } from "@next/env";

const loadEnvironment = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

export default loadEnvironment;
