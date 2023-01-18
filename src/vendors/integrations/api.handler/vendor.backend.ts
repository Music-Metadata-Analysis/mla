import NextConnectHandlerFactory from "./backend/handler.factory/next-connect";
import type { ApiHandlerVendorBackendInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export const apiHandlerVendorBackend: ApiHandlerVendorBackendInterface = {
  HandlerFactory: NextConnectHandlerFactory,
};
