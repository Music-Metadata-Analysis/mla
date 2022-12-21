import { mockAuthClient, mockAuthConfig } from "./vendor.mock";
import type { AuthVendorInterface } from "@src/types/integrations/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  config: mockAuthConfig,
  ApiRoutes: jest.fn(),
  Client: jest.fn(() => mockAuthClient),
};

export default authVendor;
