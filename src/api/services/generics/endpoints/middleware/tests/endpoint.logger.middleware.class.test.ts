import EndPointLoggerMiddleware from "../endpoint.logger.middleware.class";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import { mockEndpointLogger } from "@src/vendors/integrations/api.logger/__mocks__/vendor.backend.mock";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("@src/vendors/integrations/api.logger/vendor.backend");

describe(EndPointLoggerMiddleware.name, () => {
  let instance: EndPointLoggerMiddleware;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  mockEndpointLogger;

  const arrange = () =>
    (instance = new EndPointLoggerMiddleware({ log: mockEndpointLogger }));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  describe("handler", () => {
    describe("with any request", () => {
      beforeEach(async () => {
        arrange();
        createMocks();

        await instance.handler(mockReq, mockRes, mockNext);
      });

      it("should call the underlying vendor endpointlogger function as expected", () => {
        expect(mockEndpointLogger).toHaveBeenCalledTimes(1);
        expect(mockEndpointLogger).toHaveBeenCalledWith(mockReq, mockRes);
      });

      it("should call the 'next middleware' callback", () => {
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith();
      });
    });
  });
});
