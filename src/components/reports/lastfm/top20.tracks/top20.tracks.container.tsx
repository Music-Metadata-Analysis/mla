import Top20TracksReport from "./top20.tracks.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container";
import type UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";
import type { LastFMTopTracksReportResponseInterface } from "@src/web/api/lastfm/types/lastfm/response.types";

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
