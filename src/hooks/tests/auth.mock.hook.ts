import type { AuthVendorHookInterface } from "../../types/clients/auth/vendor.types";

const mockAuthHook: AuthVendorHookInterface = {
  signIn: jest.fn(),
  signOut: jest.fn(),
  status: "unauthenticated",
  user: null,
};

export const mockUserProfile = {
  name: "mockUser",
  email: "mock@gmail.com",
  oauth: "google" as const,
  image: "http://profile.com/image",
};

export default mockAuthHook;
