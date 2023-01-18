import S3PersistenceClient from "../backend/client/s3";
import { persistenceVendorBackend } from "../vendor.backend";

describe("persistenceVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(persistenceVendorBackend.PersistenceClient).toBe(
      S3PersistenceClient
    );
  });
});
