import StdOutLogger from "./endpoint.logger/stdout";
import type { ApiLoggerVendorInterface } from "@src/types/integrations/api.logger/vendor.types";

const apiLoggerVendor: ApiLoggerVendorInterface = {
  endpointLogger: StdOutLogger,
};

export default apiLoggerVendor;
