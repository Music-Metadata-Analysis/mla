import PlayCountByArtistReport from "../state/queries/playcount.artists.report.class";
import SunBurstContainer from "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";
import type PlayCountByArtistState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";

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
