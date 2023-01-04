import CdnAbstractBaseClient from "../cdn/bases/cdn.base.client.class";
import type { CacheVendorInterface } from "@src/backend/api/types/integrations/cache/vendor.types";

jest.mock("../cdn/bases/cdn.base.client.class");

const cacheVendor: CacheVendorInterface = {
  CdnBaseClient: CdnAbstractBaseClient,
};

export default cacheVendor;
