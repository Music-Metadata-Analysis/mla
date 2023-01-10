import type { FlagVendorSSRClientInterface } from "@src/vendors/types/integrations/flags/vendor.ssr.types";

export const mockFlagVendorSSRClient = { getState: jest.fn() } as Record<
  keyof FlagVendorSSRClientInterface,
  jest.Mock
>;
