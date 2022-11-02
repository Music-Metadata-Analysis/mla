import { Component } from "react";
import type useRouter from "@src/hooks/router";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMReportInterface } from "@src/types/clients/api/lastfm/data.report.types";

export interface ErrorBaseProps<ReportType, DrawerProps> {
  router: ReturnType<typeof useRouter>;
  report: LastFMReportInterface<ReportBaseState, ReportType, DrawerProps>;
  userProperties: ReportBaseState["userProperties"];
}

abstract class ErrorDisplayBase<ReportType, DrawerProps> extends Component<
  ErrorBaseProps<ReportType, DrawerProps>
> {}

export default ErrorDisplayBase;
