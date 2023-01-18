import { mockFlagClient, mockFlagGroup } from "./vendor.backend.mock";
import type { FlagVendorBackendInterface } from "@src/vendors/types/integrations/flags/vendor.backend.types";

export const flagVendorBackend: FlagVendorBackendInterface = {
  Client: jest.fn(() => mockFlagClient),
  Group: jest.fn(() => mockFlagGroup),
};
