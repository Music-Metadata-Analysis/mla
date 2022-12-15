export interface PersistanceVendor {
  PersistanceClient: new (partitionName: string) => PersistanceVendorInterface;
}

export type PersistanceVendorClientHeaders = {
  ContentType: string;
  CacheControl?: string;
};

export type PersistanceVendorDataType =
  | string
  | Record<string | number | symbol, unknown>;

export interface PersistanceVendorInterface {
  write(
    keyName: string,
    data: PersistanceVendorDataType,
    headers: PersistanceVendorClientHeaders
  ): void;
}
