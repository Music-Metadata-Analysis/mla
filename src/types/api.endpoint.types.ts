import type { NextApiRequest, NextApiResponse } from "next";
import type {
  createRequest,
  createResponse,
  MockResponse,
  MockRequest,
} from "node-mocks-http";

export interface LastFMEndpointRequest extends NextApiRequest {
  proxyResponse?: string;
}

export type LastFMEndpointResponse = NextApiResponse;

export type BodyType = { [key: string]: string };
export type QueryParamType = { [key: string]: string[] | string };
export type PathParamType = { [key: string]: string };

export type MockAPIResponse = MockResponse<
  NextApiResponse & ReturnType<typeof createResponse>
>;

export type MockAPIRequest = MockRequest<
  NextApiRequest & ReturnType<typeof createRequest>
>;
