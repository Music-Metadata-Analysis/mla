import persistanceVendor from "../persistance/vendor";
import type {
  PersistanceDataType,
  PersistanceVendorInterface,
} from "../../../types/integrations/persistance/vendor.types";
import type { Profile } from "next-auth";

class ProfilePersistanceClient {
  protected client: PersistanceVendorInterface;

  constructor(partitionName: string) {
    this.client = new persistanceVendor.PersistanceClient(partitionName);
  }

  async persistProfile(profile?: Profile) {
    if (profile?.email) {
      await this.client.write(profile.email, profile as PersistanceDataType, {
        ContentType: "application/json",
      });
    }
  }
}

export default ProfilePersistanceClient;
