import Condition from "@src/components/condition/condition.component";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { voidFn } from "@src/utilities/generics/voids";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import { webFrameworkVendorSSR } from "@src/vendors/integrations/web.framework/vendor.ssr";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";

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
