import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

export default function SearchLastFMTop20Tracks() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchContainer
        titleText={t("top20Tracks.searchTitle")}
        route={routes.reports.lastfm.top20tracks}
      />
    </ErrorBoundary>
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
