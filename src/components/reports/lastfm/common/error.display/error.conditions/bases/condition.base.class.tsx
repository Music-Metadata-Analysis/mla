import { Component } from "react";
import type useRouter from "@src/hooks/router";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportInterface } from "@src/types/clients/api/lastfm/data.report.types";

abstract class ErrorDisplayConditionBase<
  ReportType,
  DrawerProps
> extends Component<{
  router: ReturnType<typeof useRouter>;
  report: LastFMReportInterface<ReportBaseState, ReportType, DrawerProps>;
  userProperties: ReportBaseState["userProperties"];
}> {}

export default ErrorDisplayConditionBase;
