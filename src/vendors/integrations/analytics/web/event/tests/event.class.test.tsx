import EventDefinition from "../event.class";

describe("Event Definition", () => {
  let event: EventDefinition;
  const definition = {
    category: "TEST" as const,
    label: "TEST" as const,
    action: "Test Action" as const,
  };

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
