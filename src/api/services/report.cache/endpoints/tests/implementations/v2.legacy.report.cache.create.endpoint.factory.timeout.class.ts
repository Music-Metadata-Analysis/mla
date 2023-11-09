import ReportCacheCreateEndpointBaseV2 from "../../v2.legacy.report.cache.create.endpoint.factory.class";
import type {
  ApiEndpointRequestBodyType,
  ApiEndpointRequestQueryParamType,
} from "@src/contracts/api/types/request.types";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ReportCacheEndpointTestDoubleWithTimeoutV2 extends ReportCacheCreateEndpointBaseV2 {
  public timeOut = 10;
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
