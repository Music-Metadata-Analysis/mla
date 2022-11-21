import mockToggleHookValues from "@src/hooks/utility/__mocks__/toggle.hook.mock";
import makeUniqueHookMock from "@src/tests/fixtures/hooks/unique";

const mockValues = {
  hamburger:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  mobileMenu:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  navigation:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
};

export default mockValues;
