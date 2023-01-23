import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export default function SearchLastFMTop20Artists() {
  const { t } = useTranslation("lastfm");

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
