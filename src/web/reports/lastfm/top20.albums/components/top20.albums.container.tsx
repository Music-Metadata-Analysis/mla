import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import Top20AlbumsQuery from "@src/web/reports/lastfm/top20.albums/state/queries/top20.albums.query.class";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/lastfm.api.response.types";
import type { reportHookAsLastFMTop20AlbumReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type LastFMReportFlipCardTopAlbumsStateEncapsulation from "@src/web/reports/lastfm/top20.albums/state/encapsulations/lastfm.report.encapsulation.top.albums.flipcard.class";

export interface Top20AlbumsReportContainerProps {
  userName: string;
  lastfm: reportHookAsLastFMTop20AlbumReport;
}

export default function Top20AlbumsContainer({
  lastfm,
  userName,
}: Top20AlbumsReportContainerProps) {
  return (
    <FlipCardReportContainer<
      LastFMReportFlipCardTopAlbumsStateEncapsulation,
      LastFMTopAlbumsReportResponseInterface["albums"]
    >
      lastfm={lastfm}
      userName={userName}
      queryClass={Top20AlbumsQuery}
    />
  );
}
