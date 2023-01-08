import { Component } from "react";
import type { RouterHookType } from "@src/hooks/router.hook";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/base.types";

export interface ErrorBaseProps<ReportType, DrawerProps> {
  router: RouterHookType;
  report: LastFMReportStateQueryInterface<
    ReportBaseState,
    ReportType,
    DrawerProps
  >;
  userProperties: ReportBaseState["userProperties"];
}

abstract class ErrorDisplayBase<ReportType, DrawerProps> extends Component<
  ErrorBaseProps<ReportType, DrawerProps>
> {}

export default ErrorDisplayBase;
