import NextConnectHandlerFactory from "./handler.factory/next-connect";
import type { ApiHandlerVendorInterface } from "@src/types/integrations/api.handler/vendor.types";

const apiHandlerVendor: ApiHandlerVendorInterface = {
  HandlerFactory: NextConnectHandlerFactory,
};

export default apiHandlerVendor;
