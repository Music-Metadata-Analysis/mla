import ProxyError from "../proxy.error.class";

describe("ProxyError", () => {
  let err: ProxyError;
  let statusCode: number;
  const mockError = "mockError";

  describe("when instantiated with a status code", () => {
    beforeEach(() => {
      statusCode = 999;
      err = new ProxyError(mockError, statusCode);
    });

    it("should have the correct properties", () => {
      expect(err.message).toBe(mockError);
      expect(err.clientStatusCode).toBe(statusCode);
    });
  });

  describe("when instantiated without a status code", () => {
    beforeEach(() => {
      err = new ProxyError(mockError);
    });

    it("should have the correct properties", () => {
      expect(err.message).toBe(mockError);
      expect(err.clientStatusCode).toBeUndefined();
    });
  });
});
