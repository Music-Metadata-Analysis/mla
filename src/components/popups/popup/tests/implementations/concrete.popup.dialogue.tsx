import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import type { PopUpComponentProps } from "@src/types/controllers/popups/component.popups.types";

export const testIDs = {
  MockPopUpComponent: "MockPopUpComponent",
  MockPopUpComponentCloseButton: "MockPopUpComponentCloseButton",
  MockPopUpComponentColourToggle: "MockPopUpComponentColourToggle",
  MockPopUpComponentColourMeasure: "MockPopUpComponentColourMeasure",
};

export const testColours = {
  light: "green.200",
  dark: "red.200",
};

const MockPopUpComponent = jest.fn(
  ({ message, onClose }: PopUpComponentProps) => {
    const { toggleColorMode } = useColorMode();
    const colour = useColorModeValue(testColours.light, testColours.dark);

    return (
      <div data-testid={testIDs.MockPopUpComponent}>
        <div data-testid={testIDs.MockPopUpComponentColourMeasure}>
          {colour}
        </div>
        <div
          data-testid={testIDs.MockPopUpComponentColourToggle}
          onClick={() => toggleColorMode()}
        >
          {mockColourModeToggle}
        </div>
        <div
          data-testid={testIDs.MockPopUpComponentCloseButton}
          onClick={() => onClose()}
        >
          {message}
        </div>
      </div>
    );
  }
);

export const mockColourModeToggle = "Toggle Colour Mode";
export default MockPopUpComponent;
