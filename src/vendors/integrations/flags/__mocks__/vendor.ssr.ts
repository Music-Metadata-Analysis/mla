import { mockFlagVendorSSRClient } from "./vendor.ssr.mock";
import type { FlagVendorSSRInterface } from "@src/vendors/types/integrations/flags/vendor.ssr.types";

export const flagVendorSSR: FlagVendorSSRInterface = {
  Client: jest.fn(() => mockFlagVendorSSRClient),
};
