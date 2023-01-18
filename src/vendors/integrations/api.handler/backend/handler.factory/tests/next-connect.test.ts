import nextConnect from "next-connect";
import NextConnectHandlerFactory from "../next-connect";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { NextConnect } from "next-connect";

jest.mock("next-connect");

describe(NextConnectHandlerFactory.name, () => {
  let instance: NextConnectHandlerFactory;
  let received: NextConnect<
    ApiFrameworkVendorApiRequestType,
    ApiFrameworkVendorApiResponseType
  >;

  const mockErrorHandler = jest.fn();
  const mockFallBackHandler = jest.fn();

  const mockHandler = { value: "mocked" } as unknown as ReturnType<
    typeof nextConnect
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(nextConnect).mockImplementationOnce(() => mockHandler);
    arrange();
  });

  const arrange = () => {
    instance = new NextConnectHandlerFactory({
      errorHandler: mockErrorHandler,
      fallBackHandler: mockFallBackHandler,
    });
  };

  describe("create", () => {
    beforeEach(() => (received = instance.create()));

    it("should call the underlying vendor function correctly", () => {
      expect(nextConnect).toBeCalledTimes(1);
      expect(nextConnect).toBeCalledWith({
        onError: mockErrorHandler,
        onNoMatch: mockFallBackHandler,
      });
    });

    it("should return the expected handler", () => {
      expect(received).toBe(mockHandler);
    });
  });
});
