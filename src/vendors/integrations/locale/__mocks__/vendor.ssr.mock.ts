import type { LocaleVendorSSRClientInterface } from "@src/vendors/types/integrations/locale/vendor.ssr.types";

export const mockLocaleVendorSSRClient = {
  getTranslations: jest.fn(),
} as Record<keyof LocaleVendorSSRClientInterface, jest.Mock>;
