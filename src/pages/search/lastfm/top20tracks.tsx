import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import SearchUI from "@src/components/search/lastfm/search.ui";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale";
import pagePropsGenerator from "@src/utils/page.props.static";
import { voidFn } from "@src/utils/voids";

export default function SearchLastFMTop20Tracks() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchUI
        t={t}
        title={t("top20Tracks.searchTitle")}
        route={routes.reports.lastfm.top20tracks}
      />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
