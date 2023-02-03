import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import Top20TracksReport from "@src/web/reports/lastfm/top20.tracks/state/queries/top20.tracks.query.class";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";
import type { LastFMTopTracksReportResponseInterface } from "@src/web/api/lastfm/types/response.types";
import type UserTrackDataState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";

export interface Top20TracksReportContainerProps {
  userName: string;
  lastfm: userHookAsLastFMTop20TrackReport;
}

export default function Top20TracksContainer({
  lastfm,
  userName,
}: Top20TracksReportContainerProps) {
  return (
    <FlipCardReportContainer<
      UserTrackDataState,
      LastFMTopTracksReportResponseInterface["tracks"]
    >
      lastfm={lastfm}
      userName={userName}
      reportClass={Top20TracksReport}
    />
  );
}
