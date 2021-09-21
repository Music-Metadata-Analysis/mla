import { Spinner, Flex, useColorModeValue } from "@chakra-ui/react";
import BillBoard from "../billboard.component";

export const testIDs = {
  BillboardSpinner: "BillboardSpinner",
  BillboardSpinnerVisibilityControl: "l",
};

interface BillBoardSpinnerProps {
  title: string;
  visible: boolean;
}

const BillBoardSpinner = ({ visible, title }: BillBoardSpinnerProps) => {
  const bg = useColorModeValue("gray.300", "gray.800");
  const emptyColor = useColorModeValue("gray.300", "gray.800");

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
            emptyColor={emptyColor}
            bgColor={bg}
            size={"xl"}
          />
        </Flex>
      </BillBoard>
    </div>
  );
};

export default BillBoardSpinner;
