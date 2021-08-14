import styled from "@emotion/styled";
import Image from "next/image";

export const Icon = styled(Image)`
  border-radius: 50%;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
`;
