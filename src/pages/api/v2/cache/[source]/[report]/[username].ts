import ReportCacheCreateEndpointFactoryV2 from "@src/api/services/report.cache/endpoints/v2.report.cache.create.endpoint.factory.class";

export const endpointFactory = new ReportCacheCreateEndpointFactoryV2();
export default endpointFactory.createHandler();
