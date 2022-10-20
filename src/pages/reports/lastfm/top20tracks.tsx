import FourOhFour from "../../404";
import ReportPage from "@src/components/reports/lastfm/common/report.page/report.page";
import Top20TracksReport from "@src/components/reports/lastfm/top20.tracks/top20.tracks.container";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";

export default function LastFMTop20Tracks() {
  return (
    <ReportPage<userHookAsLastFMTop20TrackReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20TracksReport}
    />
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["cards", "lastfm"],
});
