import type { FlagsmithContextType } from "flagsmith/react";

export type VendorFlagStateType = {
  serverState: FlagsmithContextType["serverState"];
  identity: string | null;
};
