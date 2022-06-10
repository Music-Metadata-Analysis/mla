import ReportPage from "../../../components/reports/lastfm/common/report.page/report.page";
import PlayCountByArtistReport from "../../../components/reports/lastfm/playcount.artists/playcount.artists.container";
import pagePropsGenerator from "../../../utils/page.props.static";
import FourOhFour from "../../404";
import type { userHookAsLastFMPlayCountByArtistReport } from "../../../types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMPlayCountByArtistReport>
      NoUserComponent={FourOhFour}
      ReportContainer={PlayCountByArtistReport}
    />
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["lastfm", "sunburst"],
});
