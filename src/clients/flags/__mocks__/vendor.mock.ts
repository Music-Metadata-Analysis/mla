import type { FlagVendorHookInterface } from "@src/types/clients/flags/vendor.types";

export const mockFlagsHook = {
  isEnabled: jest.fn(),
} as Record<keyof FlagVendorHookInterface, jest.Mock>;
