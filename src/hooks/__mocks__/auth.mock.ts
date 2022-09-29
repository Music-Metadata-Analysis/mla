import {
  mockAuthHook,
  mockUserProfile as importedMockUserProfile,
} from "@src/clients/auth/__mocks__/vendor.mock";
import type { AuthVendorHookInterface } from "@src/types/clients/auth/vendor.types";

const mockValues: AuthVendorHookInterface = mockAuthHook;

export const mockUserProfile = importedMockUserProfile;

export default mockValues;
