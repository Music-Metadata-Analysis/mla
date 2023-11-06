import type { ApiEndpointRequestExtensions } from "@src/contracts/api/types/request.types";
import type {
  VendorApiRequestType,
  VendorApiResponseType,
} from "@src/vendors/integrations/api.framework/_types/vendor.specific.types";

export interface ApiFrameworkVendorApiRequestType
  extends VendorApiRequestType,
    ApiEndpointRequestExtensions {}

export type ApiFrameworkVendorApiResponseType = VendorApiResponseType;
