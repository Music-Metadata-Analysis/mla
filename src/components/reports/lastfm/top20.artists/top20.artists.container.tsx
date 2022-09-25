import Top20ArtistsReport from "./top20.artists.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import type UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

interface Top20AlbumsReportContainerProps {
  userName: string;
  user: userHookAsLastFMTop20ArtistReport;
}

export default function Top20ArtistsContainer({
  user,
  userName,
}: Top20AlbumsReportContainerProps) {
  return (
    <FlipCardReportContainer<UserArtistDataState>
      user={user}
      userName={userName}
      reportClass={Top20ArtistsReport}
    />
  );
}
