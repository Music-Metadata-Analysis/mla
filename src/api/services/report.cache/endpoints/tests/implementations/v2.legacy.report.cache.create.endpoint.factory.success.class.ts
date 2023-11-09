import ReportCacheCreateEndpointBaseV2 from "../../v2.legacy.report.cache.create.endpoint.factory.class";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ReportCacheCreateEndpointV2TestDouble extends ReportCacheCreateEndpointBaseV2 {
  public validators = {
    mocksource: { mockreport: mockValidator },
  } as unknown as ApiValidationVendorBackendInterface;
}

export const mockValidator = jest.fn();
