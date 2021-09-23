import type { EventDefinitionType } from "../../types/analytics.types";

class EventDefinition implements EventDefinitionType {
  category;
  label;
  action;
  value;

  constructor({ category, label, action, value }: EventDefinitionType) {
    this.category = category;
    this.label = label;
    this.action = action;
    this.value = value;
  }
}

export default EventDefinition;
