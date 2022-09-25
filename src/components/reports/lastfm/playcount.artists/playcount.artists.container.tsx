import PlayCountByArtistReport from "./playcount.artists.report.class";
import SunBurstContainer from "../common/sunburst.report/sunburst.report.container";
import type PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

export interface PlayCountByArtistContainerProps {
  userName: string;
  user: userHookAsLastFMPlayCountByArtistReport;
}

export default function PlayCountByArtistContainer({
  user,
  userName,
}: PlayCountByArtistContainerProps) {
  return (
    <SunBurstContainer<PlayCountByArtistState>
      user={user}
      userName={userName}
      reportClass={PlayCountByArtistReport}
    />
  );
}
