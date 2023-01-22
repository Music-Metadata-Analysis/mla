import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import TermsOfServiceContainer from "@src/components/legal/terms/terms.container";
import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";

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
