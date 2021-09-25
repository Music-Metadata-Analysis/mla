import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import SearchForm from "../components/forms/search/lastfm/search.ui.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function SearchLastFM() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchForm />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
