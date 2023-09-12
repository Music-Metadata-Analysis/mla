import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import SearchContainer from "@src/web/search/lastfm/search.user/components/search.container";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";

export default function SearchLastFMTop20Albums() {
  const { t } = useTranslation("lastfm");

  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchContainer
        titleText={t("playCountByArtist.searchTitle")}
        route={routes.reports.lastfm.playCountByArtist}
      />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "search",
    translations: ["lastfm"],
  });
