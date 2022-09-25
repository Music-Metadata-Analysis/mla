import { NextRouter, useRouter } from "next/router";
import AuthenticationErrorConditionalDisplay from "./error.conditions/authentication.error.display.component";
import FetchFailureConditionalDisplay from "./error.conditions/failure.error.display.component";
import NoListensErrorConditionalDisplay from "./error.conditions/nolistens.error.display.component";
import NotFoundErrorConditionalDisplay from "./error.conditions/notfound.error.display.component";
import RateLimitedErrorConditionalDisplay from "./error.conditions/ratelimited.error.display.component";
import type { LastFMReportClassInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

type LastFMAggregateErrorDisplayProps<ReportType> = {
  report: LastFMReportClassInterface<LastFMUserStateBase, ReportType>;
  userProperties: LastFMUserStateBase;
};

export default function LastFMAggregateErrorDisplay<ReportType>({
  report,
  userProperties,
}: LastFMAggregateErrorDisplayProps<ReportType>) {
  const router = useRouter();

  const ErrorDisplays = [
    AuthenticationErrorConditionalDisplay,
    FetchFailureConditionalDisplay,
    NoListensErrorConditionalDisplay,
    NotFoundErrorConditionalDisplay,
    RateLimitedErrorConditionalDisplay,
  ] as Array<
    React.ComponentClass<
      LastFMAggregateErrorDisplayProps<ReportType> & { router: NextRouter }
    >
  >;

  const FindErrorDisplay = () => {
    for (const Component of ErrorDisplays) {
      const instance = new Component({ report, router, userProperties });
      const render = instance.render();
      if (render) return <>{render}</>;
    }
    return null;
  };

  return FindErrorDisplay();
}
