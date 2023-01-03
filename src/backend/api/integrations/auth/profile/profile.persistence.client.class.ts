import persistenceVendor from "../../persistence/vendor";
import type { VendorProfileType } from "../vendor.types";
import type {
  PersistenceVendorDataType,
  PersistenceVendorClientInterface,
} from "@src/types/integrations/persistence/vendor.types";

class ProfilePersistenceClient {
  protected client: PersistenceVendorClientInterface;

  constructor(partitionName: unknown) {
    this.client = new persistenceVendor.PersistenceClient(
      partitionName as string
    );
  }

  async persistProfile(profile?: VendorProfileType) {
    if (profile?.email) {
      await this.client.write(
        profile.email,
        profile as unknown as PersistenceVendorDataType,
        {
          ContentType: "application/json",
        }
      );
    }
  }
}

export default ProfilePersistenceClient;
