import type { ApiFrameworkVendorApiRequestType } from "@src/backend/api/types/integrations/api.framework/vendor.types";

export interface ApiEndpointRequestType
  extends ApiFrameworkVendorApiRequestType {
  proxyResponse?: string;
  proxyTimeoutInstance?: NodeJS.Timeout;
}

export type ApiEndpointRequestBodyType = { [key: string]: string };
export type ApiEndpointRequestQueryParamType = {
  [key: string]: string[] | string;
};
export type ApiEndpointRequestPathParamType = { [key: string]: string };
