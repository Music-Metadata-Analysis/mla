import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider, FlagsmithContextType } from "flagsmith/react";
import type { FlagVendorProviderProps } from "../../../types/clients/flags/vendor.types";

const FlagProvider = ({ state, children }: FlagVendorProviderProps) => {
  return (
    <FlagsmithProvider
      serverState={state as FlagsmithContextType["serverState"]}
      options={{
        environmentID: process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT,
      }}
      flagsmith={flagsmith}
    >
      {children}
    </FlagsmithProvider>
  );
};

export default FlagProvider;
