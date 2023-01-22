import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export type EventCreatorType = (
  eventArgs: AnalyticsEventDefinitionInterface
) => void;
