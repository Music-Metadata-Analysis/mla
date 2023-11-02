import { Icon } from "./lastfm.icon.style";
import LastFM from "@public/images/lastfm.png";

export interface LastFMIconProps {
  altText: string;
}

const LastFMIcon = ({ altText }: LastFMIconProps) => {
  return <Icon alt={altText} src={LastFM} />;
};

export default LastFMIcon;
