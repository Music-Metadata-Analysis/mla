export interface FlagVendorClientInterface {
  isEnabled: (flagName: string) => Promise<boolean> | boolean;
}

export interface FlagVendor {
  Client: new (...args: unknown[]) => FlagVendorClientInterface;
}
