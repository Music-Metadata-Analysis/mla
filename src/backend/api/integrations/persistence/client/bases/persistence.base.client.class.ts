import type {
  PersistenceVendorDataType,
  PersistenceVendorClientInterface,
  PersistenceVendorClientHeadersInterface,
} from "@src/backend/api/types/integrations/persistence/vendor.types";
export default abstract class PersistenceVendorBaseClass
  implements PersistenceVendorClientInterface
{
  protected partitionName: string;

  constructor(partitionName: string) {
    this.partitionName = partitionName;
  }

  public async write(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): Promise<void> {
    try {
      await this.writeImplementation(keyName, data, headers);
    } catch (err) {
      this.handleError(err as Error, keyName, data);
    }
  }

  protected abstract writeImplementation(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): void;

  protected handleError(
    err: Error,
    keyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: PersistenceVendorDataType
  ): void {
    console.error(`ERROR: could not save object '${keyName}'.`);
    throw err;
  }
}
