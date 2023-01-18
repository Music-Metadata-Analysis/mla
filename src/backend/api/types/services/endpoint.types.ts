import type { ApiHandlerVendorHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export interface ApiEndPointFactoryInterface {
  createHandler: () => ApiHandlerVendorHandlerType;
}
