import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import SearchForm from "../components/forms/search/lastfm/search.ui.component";
import Events from "../config/events";
import routes from "../config/routes";
import pagePropsGenerator from "../utils/page.props.server";
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

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
