import { mockLocaleVendorHOC, mockLocaleVendorHook } from "./vendor.mock";
import type { LocaleVendorInterface } from "@src/types/clients/locale/vendor.types";

const localeVendor: LocaleVendorInterface = {
  HOC: mockLocaleVendorHOC,
  hook: jest.fn(() => mockLocaleVendorHook),
};

export default localeVendor;
