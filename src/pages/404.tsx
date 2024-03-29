import routes from "@src/config/routes";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import Events from "@src/web/analytics/collection/events/definitions";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";
import Condition from "@src/web/ui/generics/components/condition/condition.component";

export default function Custom404() {
  const router = useRouter();

  const goHome = () => {
    router.push(routes.home);
  };

  return (
    <Condition isTrue={!webFrameworkVendor.isBuildTime()}>
      <ErrorBoundaryContainer
        eventDefinition={Events.General.Error}
        route={routes.home}
        stateReset={voidFn}
      >
        <ErrorDisplayContainer errorKey={"404"} handleClick={goHome} />
      </ErrorBoundaryContainer>
    </Condition>
  );
}

export const getStaticProps = webFrameworkVendorSSR.utilities.staticProps({
  pageKey: "default",
});
