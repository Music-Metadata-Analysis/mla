import { mockAuthHook, mockAuthProvider } from "./vendor.mock";
import type { AuthVendorInterface } from "@src/vendors/types/integrations/auth/vendor.types";

export const authVendor: AuthVendorInterface = {
  hook: jest.fn(() => mockAuthHook),
  Provider: mockAuthProvider,
};
