import { mockAuthVendorSSRClient } from "./vendor.ssr.mock";
import type { AuthVendorSSR } from "@src/types/clients/auth/vendor.types";

const authVendorSSR: AuthVendorSSR = {
  Client: jest.fn(() => mockAuthVendorSSRClient),
};

export default authVendorSSR;
