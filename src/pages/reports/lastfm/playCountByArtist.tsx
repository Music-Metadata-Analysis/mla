import FourOhFour from "../../404";
import ReportPage from "@src/components/reports/lastfm/common/report.page/report.page";
import PlayCountByArtistReport from "@src/components/reports/lastfm/playcount.artists/playcount.artists.container";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMPlayCountByArtistReport>
      NoUserComponent={FourOhFour}
      ReportContainer={PlayCountByArtistReport}
    />
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["lastfm", "sunburst"],
});
