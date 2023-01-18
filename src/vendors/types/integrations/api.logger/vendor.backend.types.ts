import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export interface ApiLoggerVendorEndpointLoggerInterface {
  log: ApiLoggerVendorEndpointLoggerType;
}

export type ApiLoggerVendorEndpointLoggerType = (
  req: ApiFrameworkVendorApiRequestType,
  res: ApiFrameworkVendorApiResponseType,
  next: () => void
) => void;

export interface ApiLoggerVendorBackendInterface {
  endpointLogger: new () => ApiLoggerVendorEndpointLoggerInterface;
}
