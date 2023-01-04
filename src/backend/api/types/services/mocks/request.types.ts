import type { ApiEndpointRequestType } from "@src/backend/api/types/services/request.types";
import type { createRequest, MockRequest } from "node-mocks-http";

export type MockAPIEndpointRequestType = MockRequest<
  ApiEndpointRequestType & ReturnType<typeof createRequest>
>;
