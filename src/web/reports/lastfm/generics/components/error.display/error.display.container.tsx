import AuthenticationErrorConditionalDisplay from "./error.conditions/authentication.error.display.class.component";
import FetchFailureConditionalDisplay from "./error.conditions/failure.error.display.class.component";
import NoListensErrorConditionalDisplay from "./error.conditions/nolistens.error.display.class.component";
import NotFoundErrorConditionalDisplay from "./error.conditions/notfound.error.display.class.component";
import RateLimitedErrorConditionalDisplay from "./error.conditions/ratelimited.error.display.class.component";
import useRouter from "@src/web/navigation/routing/hooks/router.hook";
import type ErrorBase from "./error.conditions/bases/error.base.class.component";
import type { ErrorBaseProps } from "./error.conditions/bases/error.base.class.component";
import type ReportEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

export type ErrorConditionProps<ReportType, DrawerProps> = {
  query: LastFMReportStateQueryInterface<
    ReportEncapsulation,
    ReportType,
    DrawerProps
  >;
  reportProperties: LastFMReportStateBase;
};

type LastFMErrorDisplayContainerProps<ReportType, DrawerProps> =
  ErrorConditionProps<ReportType, DrawerProps> & {
    children: JSX.Element | JSX.Element[];
  };

export default function LastFMErrorDisplayContainer<ReportType, DrawerProps>({
  children,
  query,
  reportProperties,
}: LastFMErrorDisplayContainerProps<ReportType, DrawerProps>) {
  const router = useRouter();

  const ErrorConditions: Array<
    new (
      props: ErrorBaseProps<ReportType, DrawerProps>
    ) => ErrorBase<ReportType, DrawerProps>
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
        query,
        router,
        reportProperties,
      }).render();
      if (rendered) return <>{rendered}</>;
    }
    return null;
  };

  const foundError = checkErrorConditions();

  if (foundError) return foundError;
  return <>{children}</>;
}
