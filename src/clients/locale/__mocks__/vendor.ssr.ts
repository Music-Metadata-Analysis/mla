import { mockLocaleVendorSSRClient } from "./vendor.ssr.mock";
import type { LocaleVendorSSR } from "@src/types/clients/locale/vendor.types";

const localeVendorSSR: LocaleVendorSSR = {
  Client: jest.fn(() => mockLocaleVendorSSRClient),
};

export default localeVendorSSR;
