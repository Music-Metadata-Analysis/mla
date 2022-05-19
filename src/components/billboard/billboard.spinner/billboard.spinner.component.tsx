import { Spinner, Flex } from "@chakra-ui/react";
import useColour from "../../../hooks/colour";
import BillBoard from "../billboard.component";

export const testIDs = {
  BillboardSpinner: "BillboardSpinner",
  BillboardSpinnerVisibilityControl: "BillboardSpinnerVisibilityControl",
};

interface BillBoardSpinnerProps {
  title: string;
  visible: boolean;
}

const BillBoardSpinner = ({ visible, title }: BillBoardSpinnerProps) => {
  const { componentColour } = useColour();

  return (
    <div
      data-testid={testIDs.BillboardSpinnerVisibilityControl}
      style={{ display: visible ? "inline" : "none" }}
    >
      <BillBoard title={title}>
        <Flex justify={"center"} pt={10} pb={20}>
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
      </BillBoard>
    </div>
  );
};

export default BillBoardSpinner;
