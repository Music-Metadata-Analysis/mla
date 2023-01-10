import EventDefinition from "../event.class";
import type { EventDefinitionType } from "@src/contracts/events/types/event.types";

describe("Event Definition", () => {
  let event: EventDefinition;
  const definition = {
    category: "TEST",
    label: "TEST",
    action: "Test Action",
  } as EventDefinitionType;

  beforeEach(() => {
    event = new EventDefinition(definition);
  });

  it("should have the correct category", () => {
    expect(event.category).toBe(definition.category);
  });

  it("should have the correct label", () => {
    expect(event.label).toBe(definition.label);
  });

  it("should have the correct action", () => {
    expect(event.action).toBe(definition.action);
  });
});
