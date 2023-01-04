import type { ApiLoggerVendorEndpointLoggerType } from "@src/backend/api/types/integrations/api.logger/vendor.types";

export const mockEndpointLogger: ApiLoggerVendorEndpointLoggerType = jest.fn(
  (req, res, next) => next()
);
