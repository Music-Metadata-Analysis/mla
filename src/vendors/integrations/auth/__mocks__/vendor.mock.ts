import { createComponent } from "@fixtures/react/parent";
import type {
  AuthVendorHookInterface,
  AuthVendorInterface,
} from "@src/vendors/types/integrations/auth/vendor.types";

export const mockAuthHook = {
  user: null,
  status: "unauthenticated",
  signIn: jest.fn(),
  signOut: jest.fn(),
} as Record<
  keyof Omit<AuthVendorHookInterface, "user" | "status">,
  jest.Mock
> & {
  user: AuthVendorHookInterface["user"];
  status: AuthVendorHookInterface["status"];
};

export const mockAuthProvider = createComponent("AuthVendorProvider")
  .default as AuthVendorInterface["Provider"];

export const mockUserProfile = {
  name: "mockUser",
  email: "mock@gmail.com",
  group: "mockGroup",
  oauth: "google" as const,
  image: "http://profile.com/image",
};
