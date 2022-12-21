export interface PersistanceVendorInterface {
  PersistanceClient: new (
    partitionName: string
  ) => PersistanceVendorClientInterface;
}

export type PersistanceVendorClientHeadersInterface = {
  ContentType: string;
  CacheControl?: string;
};

export type PersistanceVendorDataType =
  | string
  | Record<string | number | symbol, unknown>;

export interface PersistanceVendorClientInterface {
  write(
    keyName: string,
    data: PersistanceVendorDataType,
    headers: PersistanceVendorClientHeadersInterface
  ): void;
}
