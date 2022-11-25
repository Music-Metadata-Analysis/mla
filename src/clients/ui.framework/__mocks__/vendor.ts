import { mockColourModeHook, mockFormHook } from "./vendor.mock";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourModeHook: jest.fn(() => mockColourModeHook),
  formHook: jest.fn(() => mockFormHook),
};

export default uiFrameworkVendor;
