import { mockEndpointLogger } from "./vendor.backend.mock";
import type { ApiLoggerVendorBackendInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export const apiLoggerVendorBackend: ApiLoggerVendorBackendInterface = {
  endpointLogger: jest.fn(() => ({ log: mockEndpointLogger })),
};
