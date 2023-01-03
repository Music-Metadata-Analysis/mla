import { mockFlagClient, mockFlagGroup } from "./vendor.mock";
import type { FlagVendorInterface } from "@src/types/integrations/flags/vendor.types";

const flagVendor: FlagVendorInterface = {
  Client: jest.fn(() => mockFlagClient),
  Group: jest.fn(() => mockFlagGroup),
};

export default flagVendor;
