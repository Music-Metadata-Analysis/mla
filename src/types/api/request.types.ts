import type { VendorApiRequest } from "@src/types/clients/web.framework/vendor.types";
import type { createRequest, MockRequest } from "node-mocks-http";

export interface ApiEndpointRequestType extends VendorApiRequest {
  proxyResponse?: string;
  proxyTimeoutInstance?: NodeJS.Timeout;
}

export type RequestBodyType = { [key: string]: string };
export type RequestQueryParamType = { [key: string]: string[] | string };
export type RequestPathParamType = { [key: string]: string };

export type MockAPIRequestType = MockRequest<
  ApiEndpointRequestType & ReturnType<typeof createRequest>
>;
