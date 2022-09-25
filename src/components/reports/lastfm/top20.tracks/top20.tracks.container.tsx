import Top20TracksReport from "./top20.tracks.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import type UserTrackDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.track.flipcard.report.class";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";

interface Top20TracksReportContainerProps {
  userName: string;
  user: userHookAsLastFMTop20TrackReport;
}

export default function Top20TracksContainer({
  user,
  userName,
}: Top20TracksReportContainerProps) {
  return (
    <FlipCardReportContainer<UserTrackDataState>
      user={user}
      userName={userName}
      reportClass={Top20TracksReport}
    />
  );
}
