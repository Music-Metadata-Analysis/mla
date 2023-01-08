import type { SunBurstData } from "@src/types/reports/generics/sunburst.types";

export type SunBurstAggregateReportContent = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };
