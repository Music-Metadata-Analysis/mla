import ErrorBoundary from "../../../components/errors/boundary/error.boundary.component";
import Select from "../../../components/search/lastfm/select/select.report.component";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import pagePropsGenerator from "../../../utils/page.props.static";
import { voidFn } from "../../../utils/voids";

export default function SplashPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <Select />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
