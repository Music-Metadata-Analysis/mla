import { createComponent } from "@fixtures/react/parent";
import mockValues from "@src/vendors/integrations/ui.framework/web/popups/controller/__mocks__/popups.controller.hook.mock";
import type PopUpsControllerProvider from "@src/vendors/integrations/ui.framework/web/popups/provider/popups.provider";
import type {
  UIVendorProviderComponentProps,
  UIVendorColourModeType,
} from "@src/vendors/types/integrations/ui.framework/vendor.types";

export const mockColourModeHook = {
  colourMode: "dark" as UIVendorColourModeType,
  toggle: jest.fn(),
};

export const mockConfig = {
  initialColourMode: "dark" as UIVendorColourModeType,
  useSystemColourMode: false,
};

export const mockFormHook = {
  error: {
    close: jest.fn(),
    open: jest.fn(),
  },
};

export const mockPopUpCreatorHook = null;

export const mockPopUpControllerHook = mockValues;

export const MockCoreProvider = createComponent("UserInterfaceVendorProvider")
  .default as (props: UIVendorProviderComponentProps) => JSX.Element;

export const MockPopUpsProvider = createComponent("UserInterfacePopUpsProvider")
  .default as typeof PopUpsControllerProvider;
