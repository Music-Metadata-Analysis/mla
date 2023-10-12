import type { ApiHandlerVendorHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export interface ApiEndPointFactoryInterface {
  route: string;
  service: string;
  createHandler: () => ApiHandlerVendorHandlerType;
}
