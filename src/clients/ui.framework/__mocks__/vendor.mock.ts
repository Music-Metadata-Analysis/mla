import type { VendorColourModeType } from "@src/clients/ui.framework/vendor.types";

export const mockColourModeHook = {
  colourMode: "dark" as VendorColourModeType,
  toggle: jest.fn(),
};

export const mockConfig = {
  initialColourMode: "dark" as VendorColourModeType,
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
