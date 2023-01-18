import type { ApiEndpointResponseExtensions } from "@src/contracts/api/types/response.types";
import type {
  VendorApiRequestType,
  VendorApiResponseType,
} from "@src/vendors/integrations/api.framework/_types/vendor.specific.types";

export interface ApiFrameworkVendorApiRequestType
  extends VendorApiRequestType,
    ApiEndpointResponseExtensions {}

export type ApiFrameworkVendorApiResponseType = VendorApiResponseType;
