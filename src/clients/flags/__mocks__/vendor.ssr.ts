import { mockFlagVendorSSRClient } from "./vendor.ssr.mock";
import type { FlagVendorSSRInterface } from "@src/types/clients/flags/vendor.types";

const flagVendorSSR: FlagVendorSSRInterface = {
  Client: jest.fn(() => mockFlagVendorSSRClient),
};

export default flagVendorSSR;
