import type {
  PersistanceVendorDataType,
  PersistanceVendorClientInterface,
  PersistanceVendorClientHeadersInterface,
} from "@src/types/integrations/persistance/vendor.types";
export default abstract class PersistanceVendorBaseClass
  implements PersistanceVendorClientInterface
{
  protected partitionName: string;

  constructor(partitionName: string) {
    this.partitionName = partitionName;
  }

  public async write(
    keyName: string,
    data: PersistanceVendorDataType,
    headers: PersistanceVendorClientHeadersInterface
  ): Promise<void> {
    try {
      await this.writeImplementation(keyName, data, headers);
    } catch (err) {
      this.handleError(err as Error, keyName, data);
    }
  }

  protected abstract writeImplementation(
    keyName: string,
    data: PersistanceVendorDataType,
    headers: PersistanceVendorClientHeadersInterface
  ): void;

  protected handleError(
    err: Error,
    keyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: PersistanceVendorDataType
  ): void {
    console.error(`ERROR: could not save object '${keyName}'.`);
    throw err;
  }
}
