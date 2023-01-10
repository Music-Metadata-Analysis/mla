import type { AuthVendorSSRClientInterface } from "@src/vendors/types/integrations/auth/vendor.ssr.types";

export const mockAuthVendorSSRClient = { getSession: jest.fn() } as Record<
  keyof AuthVendorSSRClientInterface,
  jest.Mock
>;
