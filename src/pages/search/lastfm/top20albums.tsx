import ErrorBoundary from "../../../components/errors/boundary/error.boundary.component";
import SearchUI from "../../../components/forms/search/lastfm/top20.albums/search.ui.component";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import pagePropsGenerator from "../../../utils/page.props.static";
import { voidFn } from "../../../utils/voids";

export default function SearchLastFMTop20Albums() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchUI />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
