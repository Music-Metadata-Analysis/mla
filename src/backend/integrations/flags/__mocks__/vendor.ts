import { mockFlagClient, mockFlagGroup } from "./vendor.mock";
import type { FlagVendor } from "@src/types/integrations/flags/vendor.types";

const flagVendor: FlagVendor = {
  Client: jest.fn(() => mockFlagClient),
  Group: jest.fn(() => mockFlagGroup),
};

export default flagVendor;
