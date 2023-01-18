import CdnAbstractBaseClient from "../backend/cdn/bases/cdn.base.client.class";
import type { CacheVendorBackendInterface } from "@src/vendors/types/integrations/cache/vendor.backend.types";

jest.mock("../cdn/bases/cdn.base.client.class");

export const cacheVendorBackend: CacheVendorBackendInterface = {
  CdnBaseClient: CdnAbstractBaseClient,
};
