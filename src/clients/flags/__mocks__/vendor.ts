import { mockFlagsHook } from "./vendor.mock";
import type { FlagVendorInterface } from "@src/types/clients/flags/vendor.types";

const flagVendor: FlagVendorInterface = {
  hook: jest.fn(() => mockFlagsHook),
  Provider: require("@fixtures/react/parent").createComponent(
    "FlagVendorProvider"
  ).default,
};

export default flagVendor;
