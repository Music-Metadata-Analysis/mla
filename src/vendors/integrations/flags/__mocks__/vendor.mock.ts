import { createComponent } from "@fixtures/react/parent";
import type {
  FlagVendorHookInterface,
  FlagVendorInterface,
} from "@src/vendors/types/integrations/flags/vendor.types";

export const mockFlagsHook = {
  isEnabled: jest.fn(),
} as Record<keyof FlagVendorHookInterface, jest.Mock>;

export const mockFlagsProvider = createComponent("FlagVendorProvider")
  .default as FlagVendorInterface["Provider"];
