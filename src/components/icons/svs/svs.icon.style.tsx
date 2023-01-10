import styled from "@emotion/styled";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";

export const Icon = styled(webFrameworkVendor.ImageShim)`
  border-radius: 50%;
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  background-color: black;
`;
