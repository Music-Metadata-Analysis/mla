import S3PersistenceClient from "../client/s3";
import persistanceVendor from "../vendor";

describe("persistanceVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(persistanceVendor.PersistanceClient).toBe(S3PersistenceClient);
  });
});
