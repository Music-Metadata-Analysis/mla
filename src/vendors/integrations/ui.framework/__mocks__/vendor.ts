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
import { PopUpsControllerContext } from "../web/popups/provider/popups.provider";
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
    Context: PopUpsControllerContext, // not a mocked value
    Provider: MockPopUpsProvider,
  },
};
