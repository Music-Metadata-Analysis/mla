import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";
import PrivacyContainer from "@src/web/content/privacy/components/privacy.container";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";

export default function PrivacyPage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <PrivacyContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "privacy",
    translations: ["legal"],
  });
