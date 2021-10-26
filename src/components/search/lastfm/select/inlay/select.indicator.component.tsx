import { Box } from "@chakra-ui/react";

export interface IndicatorPropsInterface {
  indication: string;
  visible: boolean;
}

export default function Indicator({
  indication,
  visible,
}: IndicatorPropsInterface) {
  if (!visible) return null;
  return <Box mr={5}>{indication + ":"}</Box>;
}
