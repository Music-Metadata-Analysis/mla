import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import SelectContainer from "@src/components/search/lastfm/select/select.report.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

export default function SplashPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SelectContainer />
    </ErrorBoundary>
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "search",
  translations: ["lastfm"],
});
