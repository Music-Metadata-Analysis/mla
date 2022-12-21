import type { AuthVendorSSRClientInterface } from "@src/types/clients/auth/vendor.types";

export const mockAuthVendorSSRClient = { getSession: jest.fn() } as Record<
  keyof AuthVendorSSRClientInterface,
  jest.Mock
>;
