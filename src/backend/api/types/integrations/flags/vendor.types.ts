export interface FlagVendorClientInterface {
  isEnabled: (flagName: string, group?: string) => Promise<boolean> | boolean;
}

export interface FlagVendorGroupInterface {
  getFromIdentifier: (identifier?: string | null) => string | null;
}

export interface FlagVendorInterface {
  Client: new (...args: unknown[]) => FlagVendorClientInterface;
  Group: new (...args: unknown[]) => FlagVendorGroupInterface;
}
