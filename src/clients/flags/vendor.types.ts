import type { FlagsmithContextType } from "flagsmith/react";

export type VendorStateInterface = {
  serverState: FlagsmithContextType["serverState"];
  identity: string | null;
};
