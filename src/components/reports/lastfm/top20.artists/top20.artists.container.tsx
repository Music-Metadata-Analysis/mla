import Top20ArtistsReport from "./top20.artists.report.class";
import FlipCardReportContainer from "../common/flip.card.report/flip.card.report.container";
import type UserArtistDataState from "../../../../providers/user/encapsulations/lastfm/user.state.artist.class";
import type { userHookAsLastFMTop20ArtistReport } from "../../../../types/user/hook.types";

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
