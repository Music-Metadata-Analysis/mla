import ReportCacheRetrieveEndpointFactoryV2 from "@src/api/services/report.cache/endpoints/v2.report.cache.retrieve.endpoint.factory.class";

export const endpointFactory = new ReportCacheRetrieveEndpointFactoryV2();
export default endpointFactory.createHandler();
