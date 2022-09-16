export interface PersistanceVendor {
  PersistanceClient: new (partitionName: string) => PersistanceVendorInterface;
}

export type PersistanceClientHeaders = {
  ContentType: string;
  CacheControl?: string;
};

export type PersistanceDataType =
  | string
  | Record<string | number | symbol, unknown>;

export interface PersistanceVendorInterface {
  write(
    keyName: string,
    data: PersistanceDataType,
    headers: PersistanceClientHeaders
  ): void;
}
