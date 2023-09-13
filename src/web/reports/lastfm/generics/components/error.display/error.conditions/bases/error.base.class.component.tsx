import { Component } from "react";
import type { RouterHookType } from "@src/web/navigation/routing/hooks/router.hook";
import type ReportBaseState from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";

export interface ErrorBaseProps<ReportType, DrawerProps> {
  router: RouterHookType;
  query: LastFMReportStateQueryInterface<
    ReportBaseState,
    ReportType,
    DrawerProps
  >;
  reportProperties: ReportBaseState["reportProperties"];
}

abstract class ErrorDisplayBase<ReportType, DrawerProps> extends Component<
  ErrorBaseProps<ReportType, DrawerProps>
> {}

export default ErrorDisplayBase;
