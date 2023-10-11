import makeUniqueHookMock from "@src/fixtures/mocks/mock.object.unique";
import mockToggleHookValues from "@src/web/ui/generics/state/hooks/__mocks__/toggle.hook.mock";

const mockValues = {
  hamburger:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  mobileMenu:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
  navigation:
    makeUniqueHookMock<typeof mockToggleHookValues>(mockToggleHookValues),
};

export default mockValues;
