import S3PersistenceClient from "../s3/s3.client.class";
import persistanceVendor from "../vendor";

describe("persistanceVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(persistanceVendor.PersistanceClient).toBe(S3PersistenceClient);
  });
});
