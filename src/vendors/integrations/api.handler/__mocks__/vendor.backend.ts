import { MockNextConnectHandlerFactory } from "./vendor.backend.mock";
import type { ApiHandlerVendorBackendInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export const apiHandlerVendorBackend: ApiHandlerVendorBackendInterface = {
  HandlerFactory: MockNextConnectHandlerFactory,
};
