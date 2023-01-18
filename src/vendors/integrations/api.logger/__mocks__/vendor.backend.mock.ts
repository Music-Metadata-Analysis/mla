import type { ApiLoggerVendorEndpointLoggerType } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export const mockEndpointLogger: ApiLoggerVendorEndpointLoggerType = jest.fn(
  (req, res, next) => next()
);
