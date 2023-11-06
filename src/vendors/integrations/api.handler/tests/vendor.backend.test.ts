import NextConnectHandlerFactory from "../backend/handler.factory/next-connect";
import RouteHandlerMiddleWareStack from "../backend/handler.middleware/handler.middleware.stack.class";
import { apiHandlerVendorBackend } from "../vendor.backend";

describe("apiHandlerVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(apiHandlerVendorBackend.HandlerFactory).toBe(
      NextConnectHandlerFactory
    );
    expect(apiHandlerVendorBackend.HandlerMiddleWareStack).toBe(
      RouteHandlerMiddleWareStack
    );
    expect(Object.keys(apiHandlerVendorBackend).length).toBe(2);
  });
});
