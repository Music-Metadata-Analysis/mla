import ReportPage from "../../../components/reports/lastfm/common/report.page/report.page";
import Top20AlbumsReport from "../../../components/reports/lastfm/top20.albums/top20.albums.container";
import pagePropsGenerator from "../../../utils/page.props.static";
import FourOhFour from "../../404";
import type { userHookAsLastFMTop20AlbumReport } from "../../../types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMTop20AlbumReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20AlbumsReport}
    />
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["cards", "lastfm"],
});
