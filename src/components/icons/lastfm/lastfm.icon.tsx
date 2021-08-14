import { Icon } from "./lastfm.icon.styles";
import LastFM from "../../../../public/images/lastfm.png";

interface LastFMIconProps {
  height?: number;
  width?: number;
}

const LastFMIcon = ({ width = 50, height = 50 }: LastFMIconProps) => {
  return <Icon alt="LastFM" src={LastFM} width={width} height={height} />;
};

export default LastFMIcon;
