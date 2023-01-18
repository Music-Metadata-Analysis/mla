import type { NextApiRequest, NextApiResponse } from "next";
import type { createRequest, createResponse } from "node-mocks-http";

export type VendorApiRequestType = NextApiRequest;

export type VendorApiResponseType = NextApiResponse;

export type BaseMockRequestType = ReturnType<typeof createRequest>;

export type BaseMockResponseType = ReturnType<typeof createResponse>;

export type {
  MockRequest as MockRequestType,
  MockResponse as MockResponseType,
} from "node-mocks-http";
