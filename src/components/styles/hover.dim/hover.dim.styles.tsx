import { Box } from "@chakra-ui/react";
import styled from "@emotion/styled";

const DimOnHover = styled(Box)`
  &:hover {
    filter: opacity(50%);
  }
`;

export default DimOnHover;
