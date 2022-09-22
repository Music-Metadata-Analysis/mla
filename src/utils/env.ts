export const isProduction = () => {
  return process.env.NODE_ENV === "production";
};

export const isTest = () => {
  return process.env.NODE_ENV === "test";
};
