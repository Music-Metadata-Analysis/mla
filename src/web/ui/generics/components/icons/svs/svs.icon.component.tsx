import { Icon } from "./svs.icon.style";
import SVS from "@public/images/svs.png";

export interface SVSIconProps {
  altText: string;
}

const SVSIcon = ({ altText }: SVSIconProps) => {
  return <Icon alt={altText} src={SVS} />;
};

export default SVSIcon;
