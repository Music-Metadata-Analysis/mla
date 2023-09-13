import FourOhFour from "../../404";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import PlayCountByArtistReport from "@src/web/reports/lastfm/playcount.by.artist/components/playcount.by.artist.container";
import type { reportHookAsLastFMPlayCountByArtistReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<reportHookAsLastFMPlayCountByArtistReport>
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
