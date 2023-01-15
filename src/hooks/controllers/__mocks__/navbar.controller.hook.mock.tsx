import makeUniqueHookMock from "@src/tests/fixtures/mock.object.unique";
import mockToggleHookValues from "@src/utilities/react/hooks/__mocks__/toggle.hook.mock";

const mockValues = {
  hamburger:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  mobileMenu:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  navigation:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
};

export default mockValues;
