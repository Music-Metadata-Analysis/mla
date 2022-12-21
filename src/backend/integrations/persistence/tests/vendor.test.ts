import S3PersistenceClient from "../client/s3";
import persistenceVendor from "../vendor";

describe("persistenceVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(persistenceVendor.PersistenceClient).toBe(S3PersistenceClient);
  });
});
