import mockToggleHookValues from "../utility/__mocks__/toggle.mock";
import { makeUnique } from "@src/tests/fixtures/mock.utility";

const mockValues = {
  hamburger: makeUnique<typeof mockToggleHookValues>(mockToggleHookValues),
  mobileMenu: makeUnique<typeof mockToggleHookValues>(mockToggleHookValues),
  navigation: makeUnique<typeof mockToggleHookValues>(mockToggleHookValues),
};

export default mockValues;
