import FourOhFour from "../../404";
import ReportPage from "@src/components/reports/lastfm/common/report.page/report.page";
import Top20ArtistsReport from "@src/components/reports/lastfm/top20.artists/top20.artists.container";
import pagePropsGenerator from "@src/utils/page.props.static";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

export default function LastFMTop20Artists() {
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
