import { mockLocaleVendorHOC, mockLocaleVendorHook } from "./vendor.mock";
import type { LocaleVendorInterface } from "@src/vendors/types/integrations/locale/vendor.types";

export const localeVendor: LocaleVendorInterface = {
  HOC: mockLocaleVendorHOC,
  hook: jest.fn(() => mockLocaleVendorHook),
};
