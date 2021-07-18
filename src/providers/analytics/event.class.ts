import type { EventDefinitionType } from "../../types/analytics.types";

class EventDefinition {
  category: EventDefinitionType["category"];
  label: EventDefinitionType["label"];
  action: string;

  constructor({ category, label, action }: EventDefinitionType) {
    this.category = category;
    this.label = label;
    this.action = action;
  }
}

export default EventDefinition;
