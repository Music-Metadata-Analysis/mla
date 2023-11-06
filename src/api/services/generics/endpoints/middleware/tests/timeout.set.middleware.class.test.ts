import TimeoutSetMiddleware from "../timeout.set.middleware.class";
import * as status from "@src/config/status";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

describe(TimeoutSetMiddleware.name, () => {
  let instance: TimeoutSetMiddleware;
  let setTimeoutSpy: jest.SpyInstance;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  let timeOut: number;
  let service: string;

  const mockService = "mockService";
  const mockTimeOut = 10;

  const mockNext = jest.fn();
  const mockFinish = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setTimeoutSpy = jest.spyOn(window, "setTimeout");
  });

  const arrange = () => (instance = new TimeoutSetMiddleware(service, timeOut));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  describe("with a valid service", () => {
    beforeEach(() => (service = mockService));

    describe("with a valid timeOut value", () => {
      beforeEach(() => (timeOut = mockTimeOut));

      describe("when the request does not time out", () => {
        beforeEach(() =>
          mockNext.mockImplementation(() =>
            clearTimeout(mockReq.proxyTimeoutInstance)
          )
        );

        describe("handler", () => {
          describe("with any request", () => {
            beforeEach(async () => {
              arrange();
              createMocks();

              await instance.handler(mockReq, mockRes, mockNext, mockFinish);
            });

            it("should call the 'setTimeout' function with the expected values", () => {
              expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
              const callArgs = setTimeoutSpy.mock.calls[0];
              expect(typeof callArgs[0]).toBe("function");
              expect(callArgs[1]).toBe(timeOut);
              expect(callArgs.length).toBe(2);
            });

            it("should NOT set a response", () => {
              expect(mockRes._getStatusCode()).toBe(200);
              expect(mockRes._getData()).toBe("");
            });

            it("should NOT set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBeUndefined();
            });

            it("should add a proxyTimeoutInstance value to the request", () => {
              expect(mockReq.proxyTimeoutInstance).toBeDefined();
            });

            it("should NOT set a proxyResponse", () => {
              expect(mockReq.proxyResponse).toBeUndefined();
            });

            it("should call the 'next middleware' callback", () => {
              expect(mockNext).toHaveBeenCalledTimes(1);
              expect(mockNext).toHaveBeenCalledWith();
            });

            it("should NOT call the 'finish middleware' callback", () => {
              expect(mockFinish).toHaveBeenCalledTimes(0);
            });
          });
        });
      });

      describe("when the request times out", () => {
        beforeEach(() =>
          mockNext.mockImplementation(
            () => new Promise((resolve) => setTimeout(resolve, timeOut * 2))
          )
        );

        describe("handler", () => {
          describe("with any request", () => {
            beforeEach(async () => {
              arrange();
              createMocks();

              await instance.handler(mockReq, mockRes, mockNext, mockFinish);
            });

            it("should call the 'setTimeout' function with the expected values", () => {
              expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
              const callArgs = setTimeoutSpy.mock.calls[0];
              expect(typeof callArgs[0]).toBe("function");
              expect(callArgs[1]).toBe(timeOut);
              expect(callArgs.length).toBe(2);
            });

            it("should set a 503 response", () => {
              expect(mockRes._getStatusCode()).toBe(503);
              expect(mockRes._getJSONData()).toStrictEqual(
                status.STATUS_503_MESSAGE
              );
            });

            it("should set a retry-after header", () => {
              expect(mockRes.getHeader("retry-after")).toBe(0);
            });

            it("should remove the proxyTimeoutInstance value from the request", () => {
              expect(mockReq.proxyTimeoutInstance).toBeUndefined();
            });

            it("should set the expected proxyResponse", () => {
              expect(mockReq.proxyResponse).toBe(
                `${service}: Timed out! Please retry this request!`
              );
            });

            it("should call the 'finish middleware' callback", () => {
              expect(mockFinish).toHaveBeenCalledTimes(1);
              expect(mockFinish).toHaveBeenCalledWith();
            });
          });
        });
      });
    });
  });
});
