import StdOutLogger from "./backend/endpoint.logger/stdout";
import type { ApiLoggerVendorBackendInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export const apiLoggerVendorBackend: ApiLoggerVendorBackendInterface = {
  endpointLogger: StdOutLogger,
};
