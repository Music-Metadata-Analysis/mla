import type { ApiEndpointRequestType } from "@src/types/api/request.types";
import type { ApiEndpointResponseType } from "@src/types/api/response.types";

export interface ApiLoggerVendorEndpointLoggerInterface {
  log: ApiLoggerVendorEndpointLoggerType;
}

export type ApiLoggerVendorEndpointLoggerType = (
  req: ApiEndpointRequestType,
  res: ApiEndpointResponseType,
  next: () => void
) => void;

export interface ApiLoggerVendorInterface {
  endpointLogger: new () => ApiLoggerVendorEndpointLoggerInterface;
}
