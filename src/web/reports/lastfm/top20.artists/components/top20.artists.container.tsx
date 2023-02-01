import Top20ArtistsReport from "./top20.artists.report.class";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import type UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";
import type { LastFMTopArtistsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

export interface Top20ArtistsReportContainerProps {
  userName: string;
  lastfm: userHookAsLastFMTop20ArtistReport;
}

export default function Top20ArtistsContainer({
  lastfm,
  userName,
}: Top20ArtistsReportContainerProps) {
  return (
    <FlipCardReportContainer<
      UserArtistDataState,
      LastFMTopArtistsReportResponseInterface["artists"]
    >
      lastfm={lastfm}
      userName={userName}
      reportClass={Top20ArtistsReport}
    />
  );
}
