import type { VendorColourModeType } from "@src/types/clients/ui.framework/vendor.types";

export const mockColourModeHook = {
  colourMode: "dark" as VendorColourModeType,
  toggle: jest.fn(),
};