import type { LocaleVendorSSRInterface } from "@src/types/clients/locale/vendor.types";

export const mockLocaleVendorSSRClient = {
  getTranslations: jest.fn(),
} as Record<keyof LocaleVendorSSRInterface, jest.Mock>;
