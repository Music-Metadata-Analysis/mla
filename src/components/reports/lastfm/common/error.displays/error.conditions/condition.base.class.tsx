import { Component } from "react";
import type { LastFMReportClassInterface } from "../../../../../../types/clients/api/lastfm/data.report.types";
import type { LastFMUserStateBase } from "../../../../../../types/user/state.types";
import type { NextRouter } from "next/router";

abstract class ErrorDisplayConditionBase<ReportType> extends Component<{
  router: NextRouter;
  report: LastFMReportClassInterface<LastFMUserStateBase, ReportType>;
  userProperties: LastFMUserStateBase;
}> {}

export default ErrorDisplayConditionBase;
