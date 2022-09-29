import type { AuthVendorSSRInterface } from "@src/types/clients/auth/vendor.types";

export const mockAuthVendorSSRClient = { getSession: jest.fn() } as Record<
  keyof AuthVendorSSRInterface,
  jest.Mock
>;