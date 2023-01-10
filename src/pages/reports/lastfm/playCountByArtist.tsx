import FourOhFour from "../../404";
import ReportPage from "@src/components/reports/lastfm/common/report.page/report.page";
import PlayCountByArtistReport from "@src/components/reports/lastfm/playcount.artists/playcount.artists.container";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import type { userHookAsLastFMPlayCountByArtistReport } from "@src/types/user/hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<userHookAsLastFMPlayCountByArtistReport>
      NoUserComponent={FourOhFour}
      ReportContainer={PlayCountByArtistReport}
    />
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "lastfm",
    translations: ["lastfm", "sunburst"],
  });
