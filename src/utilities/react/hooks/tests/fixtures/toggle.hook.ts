import type mockToggleHook from "@src/utilities/react/hooks/__mocks__/toggle.hook.mock";

export const checkIsToggle = (
  getHookValue: () => Record<string, unknown>,
  name: string
): void => {
  const getToggle = () => getHookValue()[name] as typeof mockToggleHook;

  it(`should contain a ${name} property, with the functions of a toggle hook`, () => {
    expect(typeof getToggle().setFalse).toBe("function");
    expect(typeof getToggle().setTrue).toBe("function");
    expect(typeof getToggle().toggle).toBe("function");
  });

  it(`should contain a ${name} property, with the state boolean of a toggle hook`, () => {
    expect(typeof getToggle().state).toBe("boolean");
  });
};
