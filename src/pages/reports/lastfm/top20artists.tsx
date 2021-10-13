import ReportPage from "../../../components/reports/lastfm/common/report.page/report.page";
import Top20ArtistsReport from "../../../components/reports/lastfm/top20.artists/top20.artists.container";
import pagePropsGenerator from "../../../utils/page.props.static";
import FourOhFour from "../../404";
import type { userHookAsLastFMTop20ArtistReport } from "../../../types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMTop20ArtistReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20ArtistsReport}
    />
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "lastfm",
  translations: ["cards", "lastfm"],
});
