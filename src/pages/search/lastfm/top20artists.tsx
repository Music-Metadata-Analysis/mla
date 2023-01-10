import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale.hook";
import { voidFn } from "@src/utils/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";

export default function SearchLastFMTop20Artists() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchContainer
        titleText={t("top20Artists.searchTitle")}
        route={routes.reports.lastfm.top20artists}
      />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "search",
    translations: ["lastfm"],
  });
