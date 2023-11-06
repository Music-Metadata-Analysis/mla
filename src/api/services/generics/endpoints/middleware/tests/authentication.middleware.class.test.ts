import AuthenticationMiddleware from "../authentication.middleware.class";
import * as status from "@src/config/status";
import {
  createAPIMocks,
  mockSession,
} from "@src/vendors/integrations/api.framework/fixtures";
import { mockAuthClient } from "@src/vendors/integrations/auth/__mocks__/vendor.backend.mock";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/auth/vendor.backend");

describe(AuthenticationMiddleware.name, () => {
  let instance: AuthenticationMiddleware;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  const mockNext = jest.fn();
  const mockFinish = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => (instance = new AuthenticationMiddleware());

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  const checkAuthenticated = () => {
    it("should call the 'next middleware' callback", () => {
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it("should NOT call the 'finish middleware' callback", () => {
      expect(mockFinish).toHaveBeenCalledTimes(0);
    });

    it("should NOT set a response", () => {
      expect(mockRes._getStatusCode()).toBe(200);
      expect(mockRes._getData()).toBe("");
    });
  };

  const checkNotAuthenticated = () => {
    it("should NOT call the 'next middleware' callback", () => {
      expect(mockNext).toHaveBeenCalledTimes(0);
    });

    it("should call the 'finish middleware' callback", () => {
      expect(mockFinish).toHaveBeenCalledTimes(1);
      expect(mockFinish).toHaveBeenCalledWith();
    });

    it("should set a 401 response", () => {
      expect(mockRes._getStatusCode()).toBe(401);
      expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_401_MESSAGE);
    });
  };

  describe("with an authenticated user", () => {
    beforeEach(() => {
      mockAuthClient.getSession.mockResolvedValue(mockSession);
    });

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkAuthenticated();
      });
    });
  });

  describe("with an UNAUTHENTICATED user", () => {
    beforeEach(() => mockAuthClient.getSession.mockResolvedValue(null));

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkNotAuthenticated();
      });
    });
  });
});
