import { Component } from "react";
import type useRouter from "@src/hooks/router";
import type { LastFMReportClassInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

abstract class ErrorDisplayConditionBase<ReportType> extends Component<{
  router: ReturnType<typeof useRouter>;
  report: LastFMReportClassInterface<LastFMUserStateBase, ReportType>;
  userProperties: LastFMUserStateBase;
}> {}

export default ErrorDisplayConditionBase;
