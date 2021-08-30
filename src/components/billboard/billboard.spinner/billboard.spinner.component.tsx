import { Spinner, Flex, useColorModeValue } from "@chakra-ui/react";
import Condition from "../../condition/condition.component";
import BillBoard from "../billboard.component";

export const testIDs = {
  BillboardSpinner: "BillboardSpinner",
};

interface SpinnerProps {
  whileTrue: boolean;
  children: JSX.Element;
}

const BillBoardSpinner = ({ whileTrue, children }: SpinnerProps) => {
  const bg = useColorModeValue("gray.200", "gray.800");
  const emptyColor = useColorModeValue("gray.200", "gray.800");

  return (
    <>
      <Condition isTrue={whileTrue}>
        <BillBoard title={"Retrieving Results ..."}>
          <Flex justify={"center"} pt={10} pb={20}>
            <Spinner
              style={{ transform: "scale(1.5)" }}
              thickness="8px"
              emptyColor={emptyColor}
              bgColor={bg}
              size={"xl"}
              data-testid={testIDs.BillboardSpinner}
            />
          </Flex>
        </BillBoard>
      </Condition>
      <Condition isTrue={!whileTrue}>{children}</Condition>
    </>
  );
};

export default BillBoardSpinner;
