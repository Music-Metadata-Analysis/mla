import ReportPage from "../../../components/reports/lastfm/common/report.page/report.page";
import Top20TracksReport from "../../../components/reports/lastfm/top20.tracks/top20.tracks.container";
import pagePropsGenerator from "../../../utils/page.props.static";
import FourOhFour from "../../404";
import type { userHookAsLastFMTop20TrackReport } from "../../../types/user/hook.types";

export default function LastFMTop20Tracks() {
  return (
    <ReportPage<userHookAsLastFMTop20TrackReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20TracksReport}
    />
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["cards", "lastfm"],
});
