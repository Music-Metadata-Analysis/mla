import { ProxyError } from "../proxy.error.class";

describe("ProxyError", () => {
  let err: ProxyError;
  let statusCode: number;
  const message = "Test Error";

  describe("when given a status code", () => {
    beforeEach(() => {
      statusCode = 999;
      err = new ProxyError(message, statusCode);
    });

    it("should have the correct properties", () => {
      expect(err.message).toBe(message);
      expect(err.clientStatusCode).toBe(statusCode);
    });
  });

  describe("when not given a status code", () => {
    beforeEach(() => {
      err = new ProxyError(message);
    });

    it("should have the correct properties", () => {
      expect(err.message).toBe(message);
      expect(err.clientStatusCode).toBeUndefined();
    });
  });
});
