import type { UIVendorColourModeType } from "@src/types/clients/ui.framework/vendor.types";

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

export const mockPopUpHook = null;

export const MockProvider = require("@fixtures/react/parent").createComponent(
  "UserInterfaceVendorProvider"
).default;
