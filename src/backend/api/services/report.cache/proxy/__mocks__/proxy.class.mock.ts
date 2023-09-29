import type { ReportCacheProxyInterface } from "@src/backend/api/types/services/report.cache/proxy.types";

export const mockReportCacheProxyMethods = {
  createCacheObject: jest.fn(),
} as Record<keyof ReportCacheProxyInterface, jest.Mock>;
