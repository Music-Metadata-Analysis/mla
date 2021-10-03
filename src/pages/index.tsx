import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import Splash from "../components/splash/splash.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function SplashPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <Splash />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "home",
  translations: ["splash"],
});
