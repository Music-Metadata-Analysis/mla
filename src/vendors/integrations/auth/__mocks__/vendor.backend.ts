import { mockAuthClient, mockAuthConfig } from "./vendor.backend.mock";
import type { AuthVendorBackendInterface } from "@src/vendors/types/integrations/auth/vendor.backend.types";

export const authVendorBackend: AuthVendorBackendInterface = {
  config: mockAuthConfig,
  ApiRoutes: jest.fn(),
  Client: jest.fn(() => mockAuthClient),
};
