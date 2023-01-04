import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";
import type { MockAPIRequestType } from "@src/backend/api/types/services/request.types";
import type { MockAPIResponseType } from "@src/backend/api/types/services/response.types";

export const createAPIMocks = (
  reqOptions: RequestOptions,
  resOptions?: ResponseOptions
) => {
  return createMocks<MockAPIRequestType, MockAPIResponseType>(
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
