import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import SearchUI from "@src/components/search/lastfm/search.ui";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

export default function SearchLastFMTop20Albums() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchUI
        t={t}
        titleText={t("playCountByArtist.searchTitle")}
        route={routes.reports.lastfm.playCountByArtist}
      />
    </ErrorBoundary>
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
