import { mockAuthHook } from "./vendor.mock";
import type { AuthVendor } from "@src/types/clients/auth/vendor.types";

const authVendor: AuthVendor = {
  hook: jest.fn(() => mockAuthHook),
  Provider: require("@fixtures/react/parent").createComponent(
    "AuthVendorProvider"
  ).default,
};

export default authVendor;
