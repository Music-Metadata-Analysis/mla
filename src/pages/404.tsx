import webFrameworkVendor from "@src/clients/web.framework/vendor";
import Condition from "@src/components/condition/condition.component";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useRouter from "@src/hooks/router.hook";
import pagePropsGenerator from "@src/utils/page.props.static";
import { voidFn } from "@src/utils/voids";

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

export const getStaticProps = pagePropsGenerator({ pageKey: "default" });
