import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SplashContainer from "@src/components/splash/splash.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import pagePropsGenerator from "@src/utils/page.props.server.side";
import { voidFn } from "@src/utils/voids";

export default function SplashPage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SplashContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps = pagePropsGenerator({
  pageKey: "home",
  translations: ["splash"],
});
