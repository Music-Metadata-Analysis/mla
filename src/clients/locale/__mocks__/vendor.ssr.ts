import { mockLocaleVendorSSRClient } from "./vendor.ssr.mock";
import type { LocaleVendorSSRInterface } from "@src/types/clients/locale/vendor.types";

const localeVendorSSR: LocaleVendorSSRInterface = {
  Client: jest.fn(() => mockLocaleVendorSSRClient),
};

export default localeVendorSSR;
