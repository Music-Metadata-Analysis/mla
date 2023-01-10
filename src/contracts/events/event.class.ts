import type { EventDefinitionType } from "@src/contracts/events/types/event.types";

class EventDefinition implements EventDefinitionType {
  category: EventDefinitionType["category"];
  label: EventDefinitionType["label"];
  action: EventDefinitionType["action"];
  value: EventDefinitionType["value"];

  constructor({ category, label, action, value }: EventDefinitionType) {
    this.category = category;
    this.label = label;
    this.action = action;
    this.value = value;
  }
}

export default EventDefinition;
