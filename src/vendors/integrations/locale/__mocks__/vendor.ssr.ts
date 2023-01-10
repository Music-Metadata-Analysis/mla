import { mockLocaleVendorSSRClient } from "./vendor.ssr.mock";
import type { LocaleVendorSSRInterface } from "@src/vendors/types/integrations/locale/vendor.ssr.types";

export const localeVendorSSR: LocaleVendorSSRInterface = {
  Client: jest.fn(() => mockLocaleVendorSSRClient),
};
