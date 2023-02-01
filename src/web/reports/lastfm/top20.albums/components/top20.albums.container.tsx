import Top20AlbumsReport from "./top20.albums.report.class";
import FlipCardReportContainer from "@src/web/reports/lastfm/generics/components/report.component/flip.card/flip.card.report.container";
import type UserAlbumDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";
import type { LastFMTopAlbumsReportResponseInterface } from "@src/web/api/lastfm/types/response.types";

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
