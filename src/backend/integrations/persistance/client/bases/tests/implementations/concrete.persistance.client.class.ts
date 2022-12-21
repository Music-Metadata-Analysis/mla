import PersistanceVendorBaseClass from "@src/backend/integrations/persistance/client/bases/persistance.base.client.class";
import type {
  PersistanceVendorDataType,
  PersistanceVendorClientHeadersInterface,
} from "@src/types/integrations/persistance/vendor.types";

export default class MockConcretePersistanceVendor extends PersistanceVendorBaseClass {
  protected async writeImplementation(
    keyName: string,
    data: PersistanceVendorDataType,
    headers: PersistanceVendorClientHeadersInterface
  ): Promise<void> {
    mockPersistanceClient(keyName, data, headers);
  }
}

export const mockPersistanceClient = jest.fn();
