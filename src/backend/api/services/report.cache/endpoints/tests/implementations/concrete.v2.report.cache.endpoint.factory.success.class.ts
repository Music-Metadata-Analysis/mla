import ReportCacheRetrievalEndpointBaseV2 from "../../v2.report.cache.endpoint.abstract.factory.class";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ConcreteReportCacheEndpointV2 extends ReportCacheRetrievalEndpointBaseV2 {
  public delay = 1;
  public errorCode?: number;
  public route = "/api/v2/cache/:source/:report/:username";
  public validators = {
    mocksource: { mockreport: mockValidator },
  } as unknown as ApiValidationVendorBackendInterface;
}

export const mockValidator = jest.fn();
