import { mockFlagsHook } from "./vendor.mock";
import type { FlagVendor } from "@src/types/clients/flags/vendor.types";

const flagVendor: FlagVendor = {
  hook: jest.fn(() => mockFlagsHook),
  Provider: require("@fixtures/react/parent").createComponent(
    "FlagVendorProvider"
  ).default,
};

export default flagVendor;
