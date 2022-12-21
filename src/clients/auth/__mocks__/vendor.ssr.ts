import { mockAuthVendorSSRClient } from "./vendor.ssr.mock";
import type { AuthVendorSSRInterface } from "@src/types/clients/auth/vendor.types";

const authVendorSSR: AuthVendorSSRInterface = {
  Client: jest.fn(() => mockAuthVendorSSRClient),
};

export default authVendorSSR;
