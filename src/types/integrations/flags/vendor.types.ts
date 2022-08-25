export interface FlagProviderInterface {
  isEnabled: (flagName: string) => Promise<boolean> | boolean;
}
