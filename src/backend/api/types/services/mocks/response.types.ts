import type { ApiEndpointResponseType } from "@src/backend/api/types/services/response.types";
import type { createResponse, MockResponse } from "node-mocks-http";

export type MockAPIEndpointResponseType = MockResponse<
  ApiEndpointResponseType & ReturnType<typeof createResponse>
>;
