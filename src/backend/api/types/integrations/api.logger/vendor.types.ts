import type { ApiEndpointRequestType } from "@src/backend/api/types/services/request.types";
import type { ApiEndpointResponseType } from "@src/backend/api/types/services/response.types";

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
