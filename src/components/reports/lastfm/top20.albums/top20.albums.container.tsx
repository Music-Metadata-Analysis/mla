import Top20AlbumsReport from "./top20.albums.report.class";
import FlipCardReportContainer from "../common/flip.card.report/flip.card.report.container";
import type UserAlbumDataState from "../../../../providers/user/encapsulations/lastfm/user.state.album.class";
import type { userHookAsLastFMTop20AlbumReport } from "../../../../types/user/hook.types";

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
