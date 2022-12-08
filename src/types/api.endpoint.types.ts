import type {
  VendorApiRequest,
  VendorApiResponse,
} from "@src/types/clients/web.framework/vendor.types";
import type {
  createRequest,
  createResponse,
  MockResponse,
  MockRequest,
} from "node-mocks-http";

export interface LastFMEndpointRequest extends VendorApiRequest {
  proxyResponse?: string;
  proxyTimeoutInstance?: NodeJS.Timeout;
}

export type LastFMEndpointResponse = VendorApiResponse;

export type BodyType = { [key: string]: string };
export type QueryParamType = { [key: string]: string[] | string };
export type PathParamType = { [key: string]: string };

export type MockAPIResponse = MockResponse<
  VendorApiResponse & ReturnType<typeof createResponse>
>;

export type MockAPIRequest = MockRequest<
  VendorApiRequest & ReturnType<typeof createRequest>
>;
