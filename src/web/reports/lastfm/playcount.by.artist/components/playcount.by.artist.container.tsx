import PlayCountByArtistQuery from "../state/queries/playcount.by.artist.report.class";
import SunBurstContainer from "@src/web/reports/lastfm/generics/components/report.component/sunburst/sunburst.report.container";
import type LastFMReportPlayCountByArtistStateEncapsulation from "../state/encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";
import type { reportHookAsLastFMPlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

export interface PlayCountByArtistContainerProps {
  userName: string;
  lastfm: reportHookAsLastFMPlayCountByArtistReport;
}

export default function PlayCountByArtistContainer({
  lastfm,
  userName,
}: PlayCountByArtistContainerProps) {
  return (
    <SunBurstContainer<LastFMReportPlayCountByArtistStateEncapsulation>
      lastfm={lastfm}
      userName={userName}
      queryClass={PlayCountByArtistQuery}
    />
  );
}
