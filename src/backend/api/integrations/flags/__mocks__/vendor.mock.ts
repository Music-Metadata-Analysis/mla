import type {
  FlagVendorClientInterface,
  FlagVendorGroupInterface,
} from "@src/types/integrations/flags/vendor.types";

export const mockFlagClient = {
  isEnabled: jest.fn(),
} as Record<keyof FlagVendorClientInterface, jest.Mock>;

export const mockFlagGroup = {
  getFromIdentifier: jest.fn(),
} as Record<keyof FlagVendorGroupInterface, jest.Mock>;
