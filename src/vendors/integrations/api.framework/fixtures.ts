import { createMocks, RequestOptions, ResponseOptions } from "node-mocks-http";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";
import type { AuthVendorSessionType } from "@src/vendors/types/integrations/auth/vendor.types";

export const createAPIMocks = (
  reqOptions: RequestOptions,
  resOptions?: ResponseOptions
) => {
  return createMocks<MockAPIEndpointRequestType, MockAPIEndpointResponseType>(
    reqOptions,
    resOptions
  );
};

export const mockSession: AuthVendorSessionType = {
  name: "mockUser",
  email: "mock@gmail.com",
  oauth: "google" as const,
  image: "http://profile.com/image",
};
