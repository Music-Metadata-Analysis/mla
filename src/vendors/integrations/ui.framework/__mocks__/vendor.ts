import mockColourHook from "./vendor.colour.hook.mock";
import {
  mockColourModeHook,
  mockFormHook,
  MockCoreProvider,
  mockConfig,
  mockPopUpCreatorHook,
  mockPopUpControllerHook,
  MockPopUpsProvider,
} from "./vendor.mock";
import type { UIFrameworkVendorInterface } from "@src/vendors/types/integrations/ui.framework/vendor.types";

export const uiFrameworkVendor: UIFrameworkVendorInterface = {
  core: {
    colourHook: jest.fn(() => mockColourHook),
    colourModeHook: jest.fn(() => mockColourModeHook),
    config: mockConfig,
    formHook: jest.fn(() => mockFormHook),
    Provider: MockCoreProvider,
  },
  popups: {
    controllerHook: jest.fn(() => mockPopUpControllerHook),
    creatorHook: jest.fn(() => mockPopUpCreatorHook),
    Provider: MockPopUpsProvider,
  },
};
