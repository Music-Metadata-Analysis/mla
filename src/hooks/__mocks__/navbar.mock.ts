import mockToggleHookValues from "../utility/__mocks__/toggle.mock";
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
