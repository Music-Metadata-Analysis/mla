import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import Top20AlbumsReport from "@src/web/reports/lastfm/top20.albums/state/queries/top20.albums.query.class";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";
import type UserAlbumDataState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";

export interface Top20AlbumsReportContainerProps {
  userName: string;
  lastfm: userHookAsLastFMTop20AlbumReport;
}

export default function Top20AlbumsContainer({
  lastfm,
  userName,
}: Top20AlbumsReportContainerProps) {
  return (
    <FlipCardReportContainer<
      UserAlbumDataState,
      LastFMTopAlbumsReportResponseInterface["albums"]
    >
      lastfm={lastfm}
      userName={userName}
      reportClass={Top20AlbumsReport}
    />
  );
}
