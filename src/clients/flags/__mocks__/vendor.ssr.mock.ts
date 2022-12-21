import type { FlagVendorSSRClientInterface } from "@src/types/clients/flags/vendor.types";

export const mockFlagVendorSSRClient = { getState: jest.fn() } as Record<
  keyof FlagVendorSSRClientInterface,
  jest.Mock
>;
