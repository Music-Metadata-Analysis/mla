import persistanceVendor from "../../persistance/vendor";
import type { VendorProfileType } from "../vendor.types";
import type {
  PersistanceVendorDataType,
  PersistanceVendorClientInterface,
} from "@src/types/integrations/persistance/vendor.types";

class ProfilePersistanceClient {
  protected client: PersistanceVendorClientInterface;

  constructor(partitionName: unknown) {
    this.client = new persistanceVendor.PersistanceClient(
      partitionName as string
    );
  }

  async persistProfile(profile?: VendorProfileType) {
    if (profile?.email) {
      await this.client.write(
        profile.email,
        profile as PersistanceVendorDataType,
        {
          ContentType: "application/json",
        }
      );
    }
  }
}

export default ProfilePersistanceClient;
