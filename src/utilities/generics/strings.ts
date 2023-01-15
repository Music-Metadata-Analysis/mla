export const alwaysString = (value: string | undefined | null): string => {
  if (value) return value;
  return "";
};

export const capitalize = (value: string): string => {
  if (value.length) return value.charAt(0).toUpperCase() + value.slice(1);
  return value;
};

export const singular = (value: string): string => {
  if (value.endsWith("s") || value.endsWith("S")) return value.slice(0, -1);
  return value;
};

export const truncate = (name: string, maximumLength: number): string => {
  if (name.length <= maximumLength) return name;
  return name.slice(0, maximumLength - 3) + "...";
};
