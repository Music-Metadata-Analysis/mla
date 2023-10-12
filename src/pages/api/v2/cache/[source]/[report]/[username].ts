import ReportCacheEndpointAbstractFactoryV2 from "@src/api/services/report.cache/endpoints/v2.report.cache.endpoint.abstract.factory.class";
import apiRoutes from "@src/config/apiRoutes";

class ReportCacheEndpointFactoryV2 extends ReportCacheEndpointAbstractFactoryV2 {
  public readonly route = apiRoutes.v2.cache;
}

export const endpointFactory = new ReportCacheEndpointFactoryV2();
export default endpointFactory.createHandler();
