import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "../../types/api.endpoint.types";

export const createAPIMocks = (
  reqOptions: RequestOptions,
  resOptions?: ResponseOptions
) => {
  return createMocks<MockAPIRequest, MockAPIResponse>(reqOptions, resOptions);
};

export const mockSession = {
  name: "mockUser",
  email: "mock@gmail.com",
  oauth: "google" as const,
  image: "http://profile.com/image",
};
