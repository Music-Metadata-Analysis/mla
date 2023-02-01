import FourOhFour from "../../404";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import Top20TracksReport from "@src/web/reports/lastfm/top20.tracks/components/top20.tracks.container";
import type { userHookAsLastFMTop20TrackReport } from "@src/types/user/hook.types";

export default function LastFMTop20Tracks() {
  return (
    <ReportPage<userHookAsLastFMTop20TrackReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20TracksReport}
    />
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "lastfm",
    translations: ["cards", "lastfm"],
  });
