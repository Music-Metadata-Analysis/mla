import AuthenticationErrorConditionalDisplay from "./error.conditions/authentication.error.display.component";
import FetchFailureConditionalDisplay from "./error.conditions/failure.error.display.component";
import NoListensErrorConditionalDisplay from "./error.conditions/nolistens.error.display.component";
import NotFoundErrorConditionalDisplay from "./error.conditions/notfound.error.display.component";
import RateLimitedErrorConditionalDisplay from "./error.conditions/ratelimited.error.display.component";
import useRouter from "@src/hooks/router";
import type ReportStateBase from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

export type ErrorConditionProps<ReportType, DrawerProps> = {
  report: LastFMReportInterface<ReportStateBase, ReportType, DrawerProps>;
  userProperties: LastFMUserStateBase;
};

type LastFMErrorDisplayContainerProps<ReportType, DrawerProps> =
  ErrorConditionProps<ReportType, DrawerProps> & {
    children: JSX.Element | JSX.Element[];
  };

export default function LastFMErrorDisplayContainer<ReportType, DrawerProps>({
  children,
  report,
  userProperties,
}: LastFMErrorDisplayContainerProps<ReportType, DrawerProps>) {
  const router = useRouter();

  const ErrorConditions = [
    AuthenticationErrorConditionalDisplay,
    FetchFailureConditionalDisplay,
    NoListensErrorConditionalDisplay,
    NotFoundErrorConditionalDisplay,
    RateLimitedErrorConditionalDisplay,
  ] as Array<
    React.ComponentClass<
      ErrorConditionProps<ReportType, DrawerProps> & {
        router: ReturnType<typeof useRouter>;
      }
    >
  >;

  const checkErrorConditions = () => {
    for (const ErrorComponent of ErrorConditions) {
      const rendered = new ErrorComponent({
        report,
        router,
        userProperties,
      }).render();
      if (rendered) return <>{rendered}</>;
    }
    return null;
  };

  const foundError = checkErrorConditions();

  if (foundError) return foundError;
  return <>{children}</>;
}
