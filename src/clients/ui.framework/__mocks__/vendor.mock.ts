import type { ColourModeType } from "@src/types/clients/ui.framework/vendor.types";

export const mockColourModeHook = {
  colourMode: "dark" as ColourModeType,
  toggle: jest.fn(),
};
