import PersistenceVendorBaseClass from "@src/vendors/integrations/persistence/backend/client/bases/persistence.base.client.class";
import type {
  PersistenceVendorDataType,
  PersistenceVendorClientHeadersInterface,
} from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default class MockConcretePersistenceVendor extends PersistenceVendorBaseClass {
  protected async writeImplementation(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): Promise<void> {
    mockPersistenceClient(keyName, data, headers);
  }
}

export const mockPersistenceClient = jest.fn();
