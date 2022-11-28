import { mockColourModeHook, mockFormHook, mockPopUpHook } from "./vendor.mock";
import type { UIFrameworkVendor } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendor = {
  colourModeHook: jest.fn(() => mockColourModeHook),
  createPopUpHook: jest.fn(() => mockPopUpHook),
  formHook: jest.fn(() => mockFormHook),
};

export default uiFrameworkVendor;
