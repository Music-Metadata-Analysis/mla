import { mockReportCacheProxyMethods } from "./proxy.class.mock";

const mockProxy = jest.fn(() => mockReportCacheProxyMethods);

export default mockProxy;
