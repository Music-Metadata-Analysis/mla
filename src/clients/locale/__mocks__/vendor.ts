import { mockLocaleVendorHOC, mockLocaleVendorHook } from "./vendor.mock";
import type { LocaleVendor } from "@src/types/clients/locale/vendor.types";

const localeVendor: LocaleVendor = {
  HOC: mockLocaleVendorHOC,
  hook: jest.fn(() => mockLocaleVendorHook),
};

export default localeVendor;
