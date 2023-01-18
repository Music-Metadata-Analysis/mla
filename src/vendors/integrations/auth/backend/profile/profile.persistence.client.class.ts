import { persistenceVendorBackend } from "@src/vendors/integrations/persistence/vendor.backend";
import type { VendorProfileType } from "../../vendor.types";
import type {
  PersistenceVendorDataType,
  PersistenceVendorClientInterface,
} from "@src/vendors/types/integrations/persistence/vendor.backend.types";

class ProfilePersistenceClient {
  protected client: PersistenceVendorClientInterface;

  constructor(partitionName: unknown) {
    this.client = new persistenceVendorBackend.PersistenceClient(
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
