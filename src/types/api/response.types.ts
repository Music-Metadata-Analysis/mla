import type { VendorApiResponse } from "@src/types/clients/web.framework/vendor.types";
import type { createResponse, MockResponse } from "node-mocks-http";

export type ApiEndpointResponseType = VendorApiResponse;

export type MockAPIResponseType = MockResponse<
  ApiEndpointResponseType & ReturnType<typeof createResponse>
>;
