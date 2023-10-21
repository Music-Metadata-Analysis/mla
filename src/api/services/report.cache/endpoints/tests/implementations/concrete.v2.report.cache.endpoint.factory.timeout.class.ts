import ReportCacheRetrievalEndpointBaseV2 from "../../v2.report.cache.endpoint.abstract.factory.class";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ConcreteReportCacheEndpointWithTimeoutV2 extends ReportCacheRetrievalEndpointBaseV2 {
  public delay = 1;
  public errorCode?: number;
  public route = "/api/v2/cache/endpoint/:report/:cacheKey";
  public timeOut = 100;
  public validators = {
    mocksource: { mockreport: mockValidator },
  } as unknown as ApiValidationVendorBackendInterface;

  protected override async getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType
  ): Promise<ReportCacheCreateResponseInterface> {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await sleep(this.timeOut * 2);
    return super.getProxyResponse(params, body);
  }
}

export const mockValidator = jest.fn();
