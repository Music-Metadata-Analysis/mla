import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SelectContainer from "@src/components/search/lastfm/select/select.report.container";
import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";

export default function SplashPage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SelectContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "search",
    translations: ["lastfm"],
  });
