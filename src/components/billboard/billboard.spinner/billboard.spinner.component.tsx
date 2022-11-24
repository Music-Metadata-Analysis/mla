import { Spinner, Flex } from "@chakra-ui/react";
import BillBoardContainer from "../billboard.base/billboard.container";
import { settings } from "@src/config/billboard";
import useColour from "@src/hooks/colour";

export const testIDs = {
  BillboardSpinner: "BillboardSpinner",
  BillboardSpinnerVisibilityControl: "BillboardSpinnerVisibilityControl",
};

interface BillBoardSpinnerProps {
  titleText: string;
  visible: boolean;
}

const BillBoardSpinner = ({ visible, titleText }: BillBoardSpinnerProps) => {
  const { componentColour } = useColour();

  const titleIsDisplayed = () => {
    return window.innerHeight >= settings.minimumTitleHeight;
  };

  return (
    <div
      data-testid={testIDs.BillboardSpinnerVisibilityControl}
      style={{ display: visible ? "inline" : "none" }}
    >
      <BillBoardContainer titleText={titleText}>
        <Flex justify={"center"} pt={10} pb={titleIsDisplayed() ? 20 : 10}>
          <Spinner
            data-testid={testIDs.BillboardSpinner}
            style={{ transform: "scale(1.5)" }}
            thickness="8px"
            color={componentColour.foreground as string}
            emptyColor={componentColour.background as string}
            bgColor={componentColour.background}
            size={"xl"}
          />
        </Flex>
      </BillBoardContainer>
    </div>
  );
};

export default BillBoardSpinner;
