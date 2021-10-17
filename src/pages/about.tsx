import About from "../components/about/about.component";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function AboutPage() {
  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <About />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({
  pageKey: "home",
  translations: ["about"],
});
