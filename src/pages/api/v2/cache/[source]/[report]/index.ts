import ReportCacheEndpointRouterFactoryV2 from "@src/api/services/report.cache/endpoints/v2.report.cache.router.factory.class";

export const endpointFactory = new ReportCacheEndpointRouterFactoryV2();
export default endpointFactory.createHandler();
