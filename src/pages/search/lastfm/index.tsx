import webFrameworkVendorSSR from "@src/clients/web.framework/vendor.ssr";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SelectContainer from "@src/components/search/lastfm/select/select.report.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { voidFn } from "@src/utils/voids";

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
