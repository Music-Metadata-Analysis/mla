import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import type { PopUpComponentProps } from "@src/vendors/types/integrations/ui.framework/popups/popups.component.types";

export const testIDs = {
  MockPopUpComponent: "MockPopUpComponent",
  MockPopUpComponentCloseButton: "MockPopUpComponentCloseButton",
  MockPopUpComponentColourIndicator: "MockPopUpComponentColourIndicator",
  MockPopUpComponentColourToggle: "MockPopUpComponentColourToggle",
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
        <div
          data-testid={testIDs.MockPopUpComponentCloseButton}
          onClick={onClose}
        >
          {message}
        </div>
        <div data-testid={testIDs.MockPopUpComponentColourIndicator}>
          {colour}
        </div>
        <div
          data-testid={testIDs.MockPopUpComponentColourToggle}
          onClick={toggleColorMode}
        />
      </div>
    );
  }
);

export default MockPopUpComponent;
