import PlayCountByArtistReport from "./playcount.artists.report.class";
import SunBurstContainer from "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container";
import type PlayCountByArtistState from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

export interface PlayCountByArtistContainerProps {
  userName: string;
  lastfm: userHookAsLastFMPlayCountByArtistReport;
}

export default function PlayCountByArtistContainer({
  lastfm,
  userName,
}: PlayCountByArtistContainerProps) {
  return (
    <SunBurstContainer<PlayCountByArtistState>
      lastfm={lastfm}
      userName={userName}
      reportClass={PlayCountByArtistReport}
    />
  );
}
