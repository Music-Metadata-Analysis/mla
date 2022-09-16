import type {
  PersistanceDataType,
  PersistanceVendorInterface,
  PersistanceClientHeaders,
} from "../../../../../types/integrations/persistance/vendor.types";
export default abstract class PersistanceVendorBaseClass
  implements PersistanceVendorInterface
{
  protected partitionName: string;

  constructor(partitionName: string) {
    this.partitionName = partitionName;
  }

  async write(
    keyName: string,
    data: PersistanceDataType,
    headers: PersistanceClientHeaders
  ) {
    try {
      await this.writeImplementation(keyName, data, headers);
    } catch (err) {
      this.handleError(err as Error, keyName, data);
    }
  }

  protected abstract writeImplementation(
    keyName: string,
    data: PersistanceDataType,
    headers: PersistanceClientHeaders
  ): void;

  protected handleError(
    err: Error,
    keyName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: PersistanceDataType
  ) {
    console.error(`ERROR: could not save object '${keyName}'.`);
    throw err;
  }
}
