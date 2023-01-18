import type {
  FlagVendorClientInterface,
  FlagVendorGroupInterface,
} from "@src/vendors/types/integrations/flags/vendor.backend.types";

export const mockFlagClient = {
  isEnabled: jest.fn(),
} as Record<keyof FlagVendorClientInterface, jest.Mock>;

export const mockFlagGroup = {
  getFromIdentifier: jest.fn(),
} as Record<keyof FlagVendorGroupInterface, jest.Mock>;
