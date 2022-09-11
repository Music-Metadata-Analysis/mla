import type { FlagVendorHookInterface } from "../../types/clients/flags/vendor.types";

const mockFlagsHook: FlagVendorHookInterface = {
  isEnabled: jest.fn(),
};

export default mockFlagsHook;
