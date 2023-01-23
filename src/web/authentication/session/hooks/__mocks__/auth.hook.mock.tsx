import {
  mockAuthHook,
  mockUserProfile as importedMockUserProfile,
} from "@src/vendors/integrations/auth/__mocks__/vendor.mock";
import type { AuthVendorHookInterface } from "@src/vendors/types/integrations/auth/vendor.types";

const mockValues: AuthVendorHookInterface = mockAuthHook;

export const mockUserProfile = importedMockUserProfile;

export default mockValues;
