import SetHeaderMiddleware from "../set.header.middleware.class";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

describe(SetHeaderMiddleware.name, () => {
  let instance: SetHeaderMiddleware;

  let headerName: string;
  let headerContent: string;

  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () =>
    (instance = new SetHeaderMiddleware(headerName, headerContent));

  const createMocks = () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({}));
  };

  describe("with a set header name and content", () => {
    beforeEach(() => {
      headerName = "mockHeaderName";
      headerContent = "mockHeaderContent";
    });

    describe("handler", () => {
      describe("with any request", () => {
        beforeEach(async () => {
          arrange();
          createMocks();

          await instance.handler(mockReq, mockRes, mockNext);
        });

        it("should set the expected response header", () => {
          expect(mockRes._getHeaders()[headerName.toLowerCase()]).toBe(
            headerContent
          );
        });

        it("should call the 'next middleware' callback", () => {
          expect(mockNext).toHaveBeenCalledTimes(1);
          expect(mockNext).toHaveBeenCalledWith();
        });
      });
    });
  });
});
