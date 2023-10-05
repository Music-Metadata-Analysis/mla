import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import Top20AlbumsQuery from "@src/web/reports/lastfm/top20.artists/state/queries/top20.artists.query.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/contracts/api/types/services/lastfm/responses/reports/top/top.artists.types";
import type { reportHookAsLastFMTop20ArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type LastFMReportFlipCardTopArtistsStateEncapsulation from "@src/web/reports/lastfm/top20.artists/state/encapsulations/lastfm.report.encapsulation.top.artists.flipcard.class";

export interface Top20ArtistsReportContainerProps {
  userName: string;
  lastfm: reportHookAsLastFMTop20ArtistReport;
}

export default function Top20ArtistsContainer({
  lastfm,
  userName,
}: Top20ArtistsReportContainerProps) {
  return (
    <FlipCardReportContainer<
      LastFMReportFlipCardTopArtistsStateEncapsulation,
      LastFMTopArtistsReportResponseInterface["artists"]
    >
      lastfm={lastfm}
      userName={userName}
      queryClass={Top20AlbumsQuery}
    />
  );
}
