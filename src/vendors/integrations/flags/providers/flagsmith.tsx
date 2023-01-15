import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider } from "flagsmith/react";
import { normalizeUndefined } from "@src/utilities/generics/voids";
import type { FlagVendorProviderProps } from "@src/vendors/types/integrations/flags/vendor.types";

const FlagProvider = ({
  state,
  children,
}: FlagVendorProviderProps): JSX.Element => {
  return (
    <FlagsmithProvider
      serverState={state.serverState}
      options={{
        environmentID: process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT,
        identity: normalizeUndefined(state?.identity),
      }}
      flagsmith={flagsmith}
    >
      {children}
    </FlagsmithProvider>
  );
};

export default FlagProvider;
