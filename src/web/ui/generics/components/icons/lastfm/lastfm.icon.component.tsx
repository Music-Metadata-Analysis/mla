import { Icon } from "./lastfm.icon.style";
import LastFM from "@public/images/lastfm.png";

export interface LastFMIconProps {
  altText: string;
  height: number;
  width: number;
}

const LastFMIcon = ({ altText, width, height }: LastFMIconProps) => {
  return <Icon alt={altText} src={LastFM} width={width} height={height} />;
};

export default LastFMIcon;
