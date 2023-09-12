import { Flex } from "@chakra-ui/react";
import ReportIndicator from "./indicator/report.indicator.component";
import { testIDs } from "./report.option.identifiers";
import Button from "@src/web/ui/generics/components/buttons/button.standard/button.standard.component";

export interface ReportOptionProps {
  analyticsName: string;
  buttonText: string;
  clickHandler: () => void;
  displayIndicator: boolean;
  indicatorText: string;
}

export default function ReportOption({
  analyticsName,
  buttonText,
  indicatorText,
  displayIndicator,
  clickHandler,
}: ReportOptionProps) {
  const selectButtonWidths = [150, 150, 200];

  return (
    <Flex align={"center"} justify={"center"} mt={2}>
      <ReportIndicator visible={displayIndicator} indication={indicatorText} />
      <Button
        data-testid={testIDs.OptionButton}
        m={1}
        w={selectButtonWidths}
        analyticsName={analyticsName}
        onClick={clickHandler}
      >
        {buttonText}
      </Button>
    </Flex>
  );
}
