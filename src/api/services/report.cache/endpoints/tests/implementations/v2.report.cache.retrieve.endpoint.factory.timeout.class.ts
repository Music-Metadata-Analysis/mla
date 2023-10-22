import ReportCacheRetrieveEndpointBaseV2 from "../../v2.report.cache.retrieve.endpoint.factory.class";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type { ReportCacheRetrieveResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default class ReportCacheEndpointTestDoubleWithTimeoutV2 extends ReportCacheRetrieveEndpointBaseV2 {
  public timeOut = 100;

  protected override async getProxyResponse(
    params: ApiEndpointRequestQueryParamType
  ): Promise<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>> {
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await sleep(this.timeOut * 2);
    return super.getProxyResponse(params);
  }
}
