export interface PersistenceVendorInterface {
  PersistenceClient: new (
    partitionName: string
  ) => PersistenceVendorClientInterface;
}

export type PersistenceVendorClientHeadersInterface = {
  ContentType: string;
  CacheControl?: string;
};

export type PersistenceVendorDataType =
  | string
  | Record<string | number | symbol, unknown>;

export interface PersistenceVendorClientInterface {
  write(
    keyName: string,
    data: PersistenceVendorDataType,
    headers: PersistenceVendorClientHeadersInterface
  ): void;
}
