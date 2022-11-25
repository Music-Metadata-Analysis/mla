import { Box } from "@chakra-ui/react";

export interface ReportIndicatorProps {
  indication: string;
  visible: boolean;
}

export default function ReportIndicator({
  indication,
  visible,
}: ReportIndicatorProps) {
  if (!visible) return null;
  return <Box mr={5}>{indication + ":"}</Box>;
}
