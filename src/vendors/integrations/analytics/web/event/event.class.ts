import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

class EventDefinition implements AnalyticsEventDefinitionInterface {
  category: AnalyticsEventDefinitionInterface["category"];
  label: AnalyticsEventDefinitionInterface["label"];
  action: AnalyticsEventDefinitionInterface["action"];
  value?: AnalyticsEventDefinitionInterface["value"];

  constructor({
    category,
    label,
    action,
    value,
  }: AnalyticsEventDefinitionInterface) {
    this.category = category;
    this.label = label;
    this.action = action;
    this.value = value;
  }
}

export default EventDefinition;
