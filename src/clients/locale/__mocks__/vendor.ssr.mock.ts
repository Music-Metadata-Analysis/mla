import type { LocaleVendorSSRClientInterface } from "@src/types/clients/locale/vendor.types";

export const mockLocaleVendorSSRClient = {
  getTranslations: jest.fn(),
} as Record<keyof LocaleVendorSSRClientInterface, jest.Mock>;
