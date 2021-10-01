import { useTranslation } from "next-i18next";
import ErrorBoundary from "../../../components/errors/boundary/error.boundary.component";
import SearchUI from "../../../components/search/lastfm/search.ui.component";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import pagePropsGenerator from "../../../utils/page.props.static";
import { voidFn } from "../../../utils/voids";

export default function SearchLastFMTop20Albums() {
  const { t } = useTranslation("lastfm");

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchUI
        t={t}
        title={t("top20Albums.searchTitle")}
        route={routes.reports.lastfm.top20albums}
      />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
