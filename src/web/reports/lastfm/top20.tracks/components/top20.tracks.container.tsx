import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import Top20TracksQuery from "@src/web/reports/lastfm/top20.tracks/state/queries/top20.tracks.query.class";
import type { LastFMTopTracksReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.tracks.types";
import type { reportHookAsLastFMTop20TrackReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type LastFMReportFlipCardTopTracksStateEncapsulation from "@src/web/reports/lastfm/top20.tracks/state/encapsulations/lastfm.report.encapsulation.top.tracks.flipcard.class";

export interface Top20TracksReportContainerProps {
  userName: string;
  lastfm: reportHookAsLastFMTop20TrackReport;
}

export default function Top20TracksContainer({
  lastfm,
  userName,
}: Top20TracksReportContainerProps) {
  return (
    <FlipCardReportContainer<
      LastFMReportFlipCardTopTracksStateEncapsulation,
      LastFMTopTracksReportResponseInterface["tracks"]
    >
      lastfm={lastfm}
      userName={userName}
      queryClass={Top20TracksQuery}
    />
  );
}
