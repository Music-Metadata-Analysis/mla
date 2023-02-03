import { Component } from "react";
import type { RouterHookType } from "@src/web/navigation/routing/hooks/router.hook";
import type ReportBaseState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

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
