import type { ApiHandlerVendorHandlerType } from "@src/types/integrations/api.handler/vendor.types";

export interface ApiEndPointFactoryInterface {
  createHandler: () => ApiHandlerVendorHandlerType;
}
