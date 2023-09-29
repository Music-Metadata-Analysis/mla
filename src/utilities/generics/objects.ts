export const keysToLower = <T extends Record<string, unknown>>(obj: T): T => {
  const caseFormattedObj: { [key: number | string | symbol]: unknown } = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (typeof k === "string") {
      k = k.toLowerCase();
    }
    if (typeof v === "object") {
      v = keysToLower(v as T);
    }
    caseFormattedObj[k] = v;
  });
  return caseFormattedObj as T;
};
