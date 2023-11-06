import TimeoutClearMiddleware from "../timeout.clear.middleware.class";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

describe(TimeoutClearMiddleware.name, () => {
  let instance: TimeoutClearMiddleware;
  let clearTimeOutSpy: jest.SpyInstance;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let proxyTimeoutInstance: undefined | NodeJS.Timeout;

  const mockNext = jest.fn();
  const mockTimeout = "mockTimeout" as unknown as NodeJS.Timeout;

  beforeEach(() => {
    jest.clearAllMocks();
    clearTimeOutSpy = jest.spyOn(window, "clearTimeout");
  });

  const arrange = () => (instance = new TimeoutClearMiddleware());

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
    mockReq.proxyTimeoutInstance = proxyTimeoutInstance;
  };

  describe("with a proxyTimeoutInstance value", () => {
    beforeEach(() => (proxyTimeoutInstance = mockTimeout));

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext);
        });

        it("should call the 'clearTimeout' function", () => {
          expect(clearTimeOutSpy).toHaveBeenCalledTimes(1);
          expect(clearTimeOutSpy).toHaveBeenCalledWith(proxyTimeoutInstance);
        });

        it("should remove the proxyTimeoutInstance value from the request", () => {
          expect(mockReq.proxyTimeoutInstance).toBeUndefined();
        });

        it("should call the 'next middleware' callback", () => {
          expect(mockNext).toHaveBeenCalledTimes(1);
          expect(mockNext).toHaveBeenCalledWith();
        });
      });
    });
  });

  describe("without a proxyTimeoutInstance value", () => {
    beforeEach(() => (proxyTimeoutInstance = undefined));

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext);
        });

        it("should NOT call the 'clearTimeout' function", () => {
          expect(clearTimeOutSpy).toHaveBeenCalledTimes(0);
        });

        it("should call the 'next middleware' callback", () => {
          expect(mockNext).toHaveBeenCalledTimes(1);
          expect(mockNext).toHaveBeenCalledWith();
        });
      });
    });
  });
});
