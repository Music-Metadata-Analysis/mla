import { mockAuthClient } from "./vendor.mock";
import type { AuthVendor } from "@src/types/integrations/auth/vendor.types";

const authVendor: AuthVendor = {
  Client: jest.fn(() => mockAuthClient),
  ApiRoutes: jest.fn(),
};

export default authVendor;
