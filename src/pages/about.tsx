import AboutContainer from "@src/components/about/about.container";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { voidFn } from "@src/utils/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";

export default function AboutPage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <AboutContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "home",
    translations: ["about"],
  });
