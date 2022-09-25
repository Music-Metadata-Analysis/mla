import type { FlagVendorHookInterface } from "@src/types/clients/flags/vendor.types";

const mockFlagsHook: FlagVendorHookInterface = {
  isEnabled: jest.fn(),
};

export default mockFlagsHook;
