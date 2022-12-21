import { mockAuthHook } from "./vendor.mock";
import type { AuthVendorInterface } from "@src/types/clients/auth/vendor.types";

const authVendor: AuthVendorInterface = {
  hook: jest.fn(() => mockAuthHook),
  Provider: require("@fixtures/react/parent").createComponent(
    "AuthVendorProvider"
  ).default,
};

export default authVendor;
