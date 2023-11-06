import DelayMiddleware from "../delay.middleware.class";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

describe(DelayMiddleware.name, () => {
  let instance: DelayMiddleware;
  let setTimeoutSpy: jest.SpyInstance;
  let delayValue: number;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setTimeoutSpy = jest.spyOn(window, "setTimeout");
  });

  const arrange = () => (instance = new DelayMiddleware(delayValue));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  describe("with a set delay value", () => {
    beforeEach(() => (delayValue = 10));

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext);
        });

        it("should call the 'setTimeout' function to create a delay", () => {
          expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
          const callArgs = setTimeoutSpy.mock.calls[0];
          expect(typeof callArgs[0]).toBe("function");
          expect(callArgs[1]).toBe(delayValue);
          expect(callArgs.length).toBe(2);
        });

        it("should call the 'next middleware' callback", () => {
          expect(mockNext).toHaveBeenCalledTimes(1);
          expect(mockNext).toHaveBeenCalledWith();
        });
      });
    });
  });
});
