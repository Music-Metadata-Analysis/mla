import { MockNextConnectHandlerFactory } from "./vendor.mock";
import type { ApiHandlerVendorInterface } from "@src/backend/api/types/integrations/api.handler/vendor.types";

const apiHandlerVendor: ApiHandlerVendorInterface = {
  HandlerFactory: MockNextConnectHandlerFactory,
};

export default apiHandlerVendor;
