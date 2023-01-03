import NextConnectHandlerFactory from "../handler.factory/next-connect";
import apiHandlerVendor from "../vendor";

describe("apiHandlerVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(apiHandlerVendor.HandlerFactory).toBe(NextConnectHandlerFactory);
  });
});
