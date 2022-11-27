import { Icon } from "./svs.icon.style";
import SVS from "@public/images/svs.png";

export interface SVSIconProps {
  altText: string;
  height: number;
  width: number;
}

const SVSIcon = ({ altText, width, height }: SVSIconProps) => {
  return <Icon alt={altText} src={SVS} width={width} height={height} />;
};

export default SVSIcon;
