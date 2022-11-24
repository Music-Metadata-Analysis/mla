import {
  Progress,
  Box,
  Flex,
  StatGroup,
  Stat,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import BillBoardContainer from "../billboard.base/billboard.container";
import useColour from "@src/hooks/colour";
import { truncate } from "@src/utils/strings";

export const testIDs = {
  BillBoardProgressBar: "BillboardSpinner",
  BillBoardProgressBarVisibilityControl: "BillboardSpinnerVisibilityControl",
};

export type BillBoardProgressBarDetails = {
  resource: string;
  type: string;
};

interface BillBoardProgressBarProps {
  titleText: string;
  visible: boolean;
  value: number;
  details: BillBoardProgressBarDetails;
}

const BillBoardProgressBar = ({
  visible,
  titleText,
  value,
  details,
}: BillBoardProgressBarProps) => {
  const { componentColour } = useColour();
  const maxLength = 18;

  const truncateResource = (input: string) => {
    return truncate(input, maxLength);
  };

  return (
    <div
      data-testid={testIDs.BillBoardProgressBarVisibilityControl}
      style={{ display: visible ? "inline" : "none" }}
    >
      <BillBoardContainer titleText={titleText}>
        <Box pt={3} pb={3}>
          <Progress
            data-testid={testIDs.BillBoardProgressBar}
            height="32px"
            colorScheme={componentColour.scheme}
            value={value}
            color={componentColour.foreground}
            bgColor={componentColour.background}
          />
        </Box>
        <Flex justifyContent={"space-between"}>
          <StatGroup>
            <Stat>
              <StatLabel>{details.type}</StatLabel>
              <StatHelpText>{truncateResource(details.resource)}</StatHelpText>
            </Stat>
          </StatGroup>
          <StatGroup>
            <Stat>
              <StatNumber>{value + "%"}</StatNumber>
            </Stat>
          </StatGroup>
        </Flex>
      </BillBoardContainer>
    </div>
  );
};

export default BillBoardProgressBar;
