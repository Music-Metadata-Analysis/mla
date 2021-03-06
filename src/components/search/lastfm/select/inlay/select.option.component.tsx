import { Flex } from "@chakra-ui/react";
import Indicator from "./select.indicator.component";
import Button from "../../../../button/button.standard/button.standard.component";

export interface SearchSelectionOptionProps {
  analyticsName: string;
  buttonText: string;
  indicatorText: string;
  visibleIndicators: boolean;
  clickHandler: () => void;
}

export const testIDs = {
  OptionButton: "OptionButton",
};

export default function SearchSelectionOption({
  analyticsName,
  buttonText,
  indicatorText,
  visibleIndicators,
  clickHandler,
}: SearchSelectionOptionProps) {
  const selectButtonWidths = [150, 150, 200];

  return (
    <Flex mb={2} align={"center"} justify={"center"}>
      <Indicator visible={visibleIndicators} indication={indicatorText} />
      <Button
        data-testid={testIDs.OptionButton}
        w={selectButtonWidths}
        analyticsName={analyticsName}
        onClick={() => clickHandler()}
      >
        {buttonText}
      </Button>
    </Flex>
  );
}
