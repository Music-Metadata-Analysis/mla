import { useRouter } from "next/router";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import ErrorDisplay from "../components/errors/display/error.display.component";
import routes from "../config/routes";
import Events from "../events/events";
import pagePropsGenerator from "../utils/page.props.static";
import { voidFn } from "../utils/voids";

export default function Custom404() {
  const router = useRouter();

  const goHome = () => {
    router.push(routes.home);
  };

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <ErrorDisplay errorKey={"404"} resetError={goHome} />
    </ErrorBoundary>
  );
}

export const getStaticProps = pagePropsGenerator({ pageKey: "default" });
