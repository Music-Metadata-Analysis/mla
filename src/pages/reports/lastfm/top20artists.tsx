import FourOhFour from "../../404";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import ReportPage from "@src/web/reports/lastfm/generics/components/report.page/report.page";
import Top20ArtistsReport from "@src/web/reports/lastfm/top20.artists/components/top20.artists.container";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

export default function LastFMTop20Artists() {
  return (
    <ReportPage<userHookAsLastFMTop20ArtistReport>
      NoUserComponent={FourOhFour}
      ReportContainer={Top20ArtistsReport}
    />
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "lastfm",
    translations: ["cards", "lastfm"],
  });
