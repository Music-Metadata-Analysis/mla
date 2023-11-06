import { createRouter } from "next-connect";
import NextConnectHandlerFactory from "../next-connect";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorRequestHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { NodeRouter } from "next-connect/dist/types/node";

jest.mock("next-connect");

describe(NextConnectHandlerFactory.name, () => {
  let instance: NextConnectHandlerFactory;
  let received: ApiHandlerVendorRequestHandlerType;

  const mockBaseHandler = jest.fn();
  const mockErrorHandler = jest.fn();

  const mockRoute = "https://mock/route";

  const mockRouter = {
    all: jest.fn(),
    handler: jest.fn(() => mockHandler),
  } as unknown as NodeRouter<
    ApiFrameworkVendorApiRequestType,
    ApiFrameworkVendorApiResponseType
  >;

  const mockHandler = {
    mock: "handler" as unknown as ApiHandlerVendorRequestHandlerType,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(
        createRouter<
          ApiFrameworkVendorApiRequestType,
          ApiFrameworkVendorApiResponseType
        >
      )
      .mockImplementationOnce(() => mockRouter);
    arrange();
  });

  const arrange = () => {
    instance = new NextConnectHandlerFactory({
      baseHandler: mockBaseHandler,
      errorHandler: mockErrorHandler,
      route: mockRoute,
    });
  };

  describe("create", () => {
    beforeEach(() => (received = instance.create()));

    it("should call the underlying vendor 'createRouter' function correctly", () => {
      expect(createRouter).toHaveBeenCalledTimes(1);
      expect(createRouter).toHaveBeenCalledWith();
    });

    it("should call the underlying vendor 'createRouter' function correctly", () => {
      expect(createRouter).toHaveBeenCalledTimes(1);
      expect(createRouter).toHaveBeenCalledWith();
    });

    it("should call the underlying vendor router's 'all' function correctly", () => {
      expect(mockRouter.all).toHaveBeenCalledTimes(1);
      expect(mockRouter.all).toHaveBeenCalledWith(mockRoute, mockBaseHandler);
    });

    it("should call the underlying vendor router's 'handler' function correctly", () => {
      expect(mockRouter.handler).toHaveBeenCalledTimes(1);
      expect(mockRouter.handler).toHaveBeenCalledWith({
        onError: mockErrorHandler,
      });
    });

    it("should return the correct value", () => {
      expect(received).toBe(mockHandler);
    });
  });
});
