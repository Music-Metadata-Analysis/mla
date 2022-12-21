import mockColourHook from "./vendor.colour.hook.mock";
import {
  mockColourModeHook,
  mockFormHook,
  mockPopUpHook,
  MockProvider,
  mockConfig,
} from "./vendor.mock";
import type { UIFrameworkVendorInterface } from "@src/types/clients/ui.framework/vendor.types";

const uiFrameworkVendor: UIFrameworkVendorInterface = {
  colourHook: jest.fn(() => mockColourHook),
  colourModeHook: jest.fn(() => mockColourModeHook),
  config: mockConfig,
  createPopUpHook: jest.fn(() => mockPopUpHook),
  formHook: jest.fn(() => mockFormHook),
  Provider: MockProvider,
};

export default uiFrameworkVendor;
