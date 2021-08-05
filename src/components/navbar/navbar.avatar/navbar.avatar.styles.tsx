import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const DimmingImage = styled(Box)`
  &:hover {
    filter: opacity(50%);
  }
`;
