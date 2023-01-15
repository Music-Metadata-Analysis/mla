export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const isTest = (): boolean => {
  return process.env.NODE_ENV === "test";
};
