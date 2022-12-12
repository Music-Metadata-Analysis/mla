import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";
import type { MockAPIRequestType } from "@src/types/api/request.types";
import type { MockAPIResponseType } from "@src/types/api/response.types";

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
