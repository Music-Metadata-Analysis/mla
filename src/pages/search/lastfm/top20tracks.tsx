import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale.hook";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

export default function SearchLastFMTop20Tracks() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchContainer
        titleText={t("top20Tracks.searchTitle")}
        route={routes.reports.lastfm.top20tracks}
      />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
