import { useRouter } from "next/router";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import ErrorDisplay from "../components/errors/display/error.display.component";
import Events from "../config/events";
import routes from "../config/routes";
import pagePropsGenerator from "../utils/page.props";
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
