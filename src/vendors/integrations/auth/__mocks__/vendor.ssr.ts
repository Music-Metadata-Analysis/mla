import { mockAuthVendorSSRClient } from "./vendor.ssr.mock";
import type { AuthVendorSSRInterface } from "@src/vendors/types/integrations/auth/vendor.ssr.types";

export const authVendorSSR: AuthVendorSSRInterface = {
  Client: jest.fn(() => mockAuthVendorSSRClient),
};
