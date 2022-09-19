export interface AuthVendorInterface {
  authorizationCookieName: string;
  generateToken: () => Promise<string> | string;
}
