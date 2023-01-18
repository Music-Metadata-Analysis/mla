import FlagSmithClient from "../backend/client/flagsmith";
import FlagSmithGroup from "../backend/group/flagsmith";
import { flagVendorBackend } from "../vendor.backend";

describe("flagVendorBackend", () => {
  it("should be configured with the correct properties", () => {
    expect(flagVendorBackend.Client).toBe(FlagSmithClient);
    expect(flagVendorBackend.Group).toBe(FlagSmithGroup);
  });
});
