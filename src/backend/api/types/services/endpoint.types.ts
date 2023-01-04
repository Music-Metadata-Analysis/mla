import type { ApiHandlerVendorHandlerType } from "@src/backend/api/types/integrations/api.handler/vendor.types";

export interface ApiEndPointFactoryInterface {
  createHandler: () => ApiHandlerVendorHandlerType;
}
