import Top20AlbumsReport from "./top20.albums.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/flip.card.report/flip.card.report.container";
import type UserAlbumDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.album.flipcard.report.class";
import type { userHookAsLastFMTop20AlbumReport } from "@src/types/user/hook.types";

interface Top20AlbumsReportContainerProps {
  userName: string;
  user: userHookAsLastFMTop20AlbumReport;
}

export default function Top20AlbumsContainer({
  user,
  userName,
}: Top20AlbumsReportContainerProps) {
  return (
    <FlipCardReportContainer<UserAlbumDataState>
      user={user}
      userName={userName}
      reportClass={Top20AlbumsReport}
    />
  );
}
