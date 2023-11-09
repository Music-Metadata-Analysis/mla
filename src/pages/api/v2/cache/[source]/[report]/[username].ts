import LegacyReportCacheCreateEndpointFactoryV2 from "@src/api/services/report.cache/endpoints/v2.legacy.report.cache.create.endpoint.factory.class";

export const endpointFactory = new LegacyReportCacheCreateEndpointFactoryV2();
export default endpointFactory.createHandler();
