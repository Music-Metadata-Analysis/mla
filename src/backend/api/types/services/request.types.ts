import type { ApiFrameworkVendorApiRequestType } from "@src/backend/api/types/integrations/api.framework/vendor.types";
import type { createRequest, MockRequest } from "node-mocks-http";

export interface ApiEndpointRequestType
  extends ApiFrameworkVendorApiRequestType {
  proxyResponse?: string;
  proxyTimeoutInstance?: NodeJS.Timeout;
}

export type ApiRequestBodyType = { [key: string]: string };
export type ApiRequestQueryParamType = { [key: string]: string[] | string };
export type ApiRequestPathParamType = { [key: string]: string };

export type MockAPIRequestType = MockRequest<
  ApiEndpointRequestType & ReturnType<typeof createRequest>
>;
