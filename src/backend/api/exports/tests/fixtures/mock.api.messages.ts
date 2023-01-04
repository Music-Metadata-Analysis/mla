import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";
import type { MockAPIEndpointRequestType } from "@src/backend/api/types/services/mocks/request.types";
import type { MockAPIEndpointResponseType } from "@src/backend/api/types/services/mocks/response.types";

export const createAPIMocks = (
  reqOptions: RequestOptions,
  resOptions?: ResponseOptions
) => {
  return createMocks<MockAPIEndpointRequestType, MockAPIEndpointResponseType>(
    reqOptions,
    resOptions
  );
};

export const mockSession = {
  name: "mockUser",
  email: "mock@gmail.com",
  oauth: "google" as const,
  image: "http://profile.com/image",
};
