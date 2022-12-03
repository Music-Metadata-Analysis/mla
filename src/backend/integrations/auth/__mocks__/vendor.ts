import { mockAuthClient, mockAuthConfig } from "./vendor.mock";
import type { AuthVendor } from "@src/types/integrations/auth/vendor.types";

const authVendor: AuthVendor = {
  config: mockAuthConfig,
  ApiRoutes: jest.fn(),
  Client: jest.fn(() => mockAuthClient),
};

export default authVendor;
