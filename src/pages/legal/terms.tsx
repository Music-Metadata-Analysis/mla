import webFrameworkVendorSSR from "@src/clients/web.framework/vendor.ssr";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import TermsOfServiceContainer from "@src/components/legal/terms/terms.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { voidFn } from "@src/utils/voids";

export default function TermsOfServicePage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <TermsOfServiceContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "terms",
    translations: ["legal"],
  });
