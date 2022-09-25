import persistanceVendor from "../../persistance/vendor";
import type { VendorProfileType } from "../vendor.types";
import type {
  PersistanceDataType,
  PersistanceVendorInterface,
} from "@src/types/integrations/persistance/vendor.types";

class ProfilePersistanceClient {
  protected client: PersistanceVendorInterface;

  constructor(partitionName: unknown) {
    this.client = new persistanceVendor.PersistanceClient(
      partitionName as string
    );
  }

  async persistProfile(profile?: VendorProfileType) {
    if (profile?.email) {
      await this.client.write(profile.email, profile as PersistanceDataType, {
        ContentType: "application/json",
      });
    }
  }
}

export default ProfilePersistanceClient;
