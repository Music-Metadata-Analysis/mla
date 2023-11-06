import EnforceMethodMiddleware from "../enforce.method.middleware.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

describe(EnforceMethodMiddleware.name, () => {
  let instance: EnforceMethodMiddleware;
  let method: HttpApiClientHttpMethodType;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  const mockNext = jest.fn();
  const mockFinish = jest.fn();
  const mockUrl = "https://mock.com/some/url";

  beforeEach(() => jest.clearAllMocks());

  const arrange = (enforcedMethod: HttpApiClientHttpMethodType) =>
    (instance = new EnforceMethodMiddleware(enforcedMethod));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: mockUrl,
      method,
    }));
  };

  const checkValidMethod = () => {
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

  const checkInValidMethod = () => {
    it("should NOT call the 'next middleware' callback", () => {
      expect(mockNext).toHaveBeenCalledTimes(0);
    });

    it("should call the 'finish middleware' callback", () => {
      expect(mockFinish).toHaveBeenCalledTimes(1);
      expect(mockFinish).toHaveBeenCalledWith();
    });

    it("should set a response", () => {
      expect(mockRes._getStatusCode()).toBe(405);
      expect(mockRes._getJSONData()).toStrictEqual(status.STATUS_405_MESSAGE);
    });
  };

  describe("when initialized as a GET enforcer", () => {
    beforeEach(() => arrange("GET"));

    describe("handler", () => {
      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkValidMethod();
      });

      describe("with a POST request", () => {
        beforeEach(async () => {
          method = "POST";
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkInValidMethod();
      });
    });
  });

  describe("when initialized as a POST enforcer", () => {
    beforeEach(() => arrange("POST"));

    describe("handler", () => {
      describe("with a GET request", () => {
        beforeEach(async () => {
          method = "GET";
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkInValidMethod();
      });

      describe("with a POST request", () => {
        beforeEach(async () => {
          method = "POST";
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext, mockFinish);
        });

        checkValidMethod();
      });
    });
  });
});
