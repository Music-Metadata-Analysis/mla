import AuthenticationErrorConditionalDisplay from "./error.conditions/authentication.error.display.class.component";
import FetchFailureConditionalDisplay from "./error.conditions/failure.error.display.class.component";
import NoListensErrorConditionalDisplay from "./error.conditions/nolistens.error.display.class.component";
import NotFoundErrorConditionalDisplay from "./error.conditions/notfound.error.display.class.component";
import RateLimitedErrorConditionalDisplay from "./error.conditions/ratelimited.error.display.class.component";
import useRouter from "@src/hooks/router.hook";
import type ErrorBase from "./error.conditions/bases/error.base.class.component";
import type { ErrorBaseProps } from "./error.conditions/bases/error.base.class.component";
import type ReportStateBase from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/base.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

export type ErrorConditionProps<ReportType, DrawerProps> = {
  report: LastFMReportStateQueryInterface<
    ReportStateBase,
    ReportType,
    DrawerProps
  >;
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

  const ErrorConditions: Array<
    new (props: ErrorBaseProps<ReportType, DrawerProps>) => ErrorBase<
      ReportType,
      DrawerProps
    >
  > = [
    AuthenticationErrorConditionalDisplay,
    FetchFailureConditionalDisplay,
    NoListensErrorConditionalDisplay,
    NotFoundErrorConditionalDisplay,
    RateLimitedErrorConditionalDisplay,
  ];

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
