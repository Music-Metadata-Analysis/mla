import NextConnectHandlerFactory from "../backend/handler.factory/next-connect";
import { apiHandlerVendorBackend } from "../vendor.backend";

describe("apiHandlerVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(apiHandlerVendorBackend.HandlerFactory).toBe(
      NextConnectHandlerFactory
    );
  });
});
