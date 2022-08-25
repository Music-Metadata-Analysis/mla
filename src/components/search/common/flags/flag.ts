import type { useFlags } from "flagsmith/react";

export const readFlag = (
  flagName: string | null | undefined,
  flagState: ReturnType<typeof useFlags>
) => {
  if (!flagName) return false;
  if (!flagState[flagName]) return false;
  return flagState[flagName].enabled;
};
