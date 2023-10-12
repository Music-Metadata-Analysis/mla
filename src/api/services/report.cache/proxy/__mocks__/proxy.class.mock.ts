import type { ReportCacheProxyInterface } from "@src/api/types/services/report.cache/proxy/proxy.types";

export const mockReportCacheProxyMethods = {
  createCacheObject: jest.fn(),
} as Record<keyof ReportCacheProxyInterface, jest.Mock>;
