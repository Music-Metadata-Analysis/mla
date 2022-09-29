import type { FlagVendorSSRInterface } from "@src/types/clients/flags/vendor.types";

export const mockFlagVendorSSRClient = { getState: jest.fn() } as Record<
  keyof FlagVendorSSRInterface,
  jest.Mock
>;
