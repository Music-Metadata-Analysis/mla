import { mockFlagVendorSSRClient } from "./vendor.ssr.mock";
import type { FlagVendorSSR } from "@src/types/clients/flags/vendor.types";

const flagVendorSSR: FlagVendorSSR = {
  Client: jest.fn(() => mockFlagVendorSSRClient),
};

export default flagVendorSSR;
