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
import useColour from "../../../hooks/colour";
import { truncate } from "../../../utils/strings";
import BillBoard from "../billboard.component";

export const testIDs = {
  BillBoardProgressBar: "BillboardSpinner",
  BillBoardProgressBarVisibilityControl: "BillboardSpinnerVisibilityControl",
};

export type BillBoardProgressBarDetails = {
  resource: string;
  type: string;
};

interface BillBoardProgressBarProps {
  title: string;
  visible: boolean;
  value: number;
  details: BillBoardProgressBarDetails;
}

const BillBoardProgressBar = ({
  visible,
  title,
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
      <BillBoard title={title}>
        <Box pt={10} pb={20}>
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
      </BillBoard>
    </div>
  );
};

export default BillBoardProgressBar;