import type { ApiFrameworkVendorApiResponseType } from "@src/types/integrations/api.framework/vendor.types";
import type { createResponse, MockResponse } from "node-mocks-http";

export type ApiEndpointResponseType = ApiFrameworkVendorApiResponseType;

export type MockAPIResponseType = MockResponse<
  ApiEndpointResponseType & ReturnType<typeof createResponse>
>;
