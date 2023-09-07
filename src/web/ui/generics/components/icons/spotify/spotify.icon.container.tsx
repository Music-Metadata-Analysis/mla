import SpotifyIcon from "./spotify.icon.component";

export interface SpotifyIconContainerProps {
  height?: number;
  width?: number;
}

const SpotifyIconContainer = ({
  width = 26,
  height = 26,
}: SpotifyIconContainerProps) => {
  return <SpotifyIcon width={width} height={height} />;
};

export default SpotifyIconContainer;
