import { mockFlagsHook, mockFlagsProvider } from "./vendor.mock";
import type { FlagVendorInterface } from "@src/vendors/types/integrations/flags/vendor.types";

export const flagVendor: FlagVendorInterface = {
  hook: jest.fn(() => mockFlagsHook),
  Provider: mockFlagsProvider,
};
