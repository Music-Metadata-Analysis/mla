import FourOhFour from "../../404";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import Top20AlbumsReport from "@src/web/reports/lastfm/top20.albums/components/top20.albums.container";
import type { reportHookAsLastFMTop20AlbumReport } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

export default function LastFMTop20Albums() {
  return (
    <ReportPage<reportHookAsLastFMTop20AlbumReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20AlbumsReport}
    />
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "lastfm",
    translations: ["cards", "lastfm"],
  });
