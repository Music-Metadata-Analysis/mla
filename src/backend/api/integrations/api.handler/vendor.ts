import NextConnectHandlerFactory from "./handler.factory/next-connect";
import type { ApiHandlerVendorInterface } from "@src/backend/api/types/integrations/api.handler/vendor.types";

const apiHandlerVendor: ApiHandlerVendorInterface = {
  HandlerFactory: NextConnectHandlerFactory,
};

export default apiHandlerVendor;
