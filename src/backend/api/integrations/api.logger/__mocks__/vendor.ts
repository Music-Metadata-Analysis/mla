import { mockEndpointLogger } from "./vendor.mock";
import type { ApiLoggerVendorInterface } from "@src/backend/api/types/integrations/api.logger/vendor.types";

const apiLoggerVendor: ApiLoggerVendorInterface = {
  endpointLogger: jest.fn(() => ({ log: mockEndpointLogger })),
};

export default apiLoggerVendor;
