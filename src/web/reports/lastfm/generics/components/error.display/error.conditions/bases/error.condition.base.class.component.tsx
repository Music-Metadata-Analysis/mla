import ErrorBase from "./error.base.class.component";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

abstract class ErrorConditionBase<ReportType, DrawerProps> extends ErrorBase<
  ReportType,
  DrawerProps
> {
  abstract error: LastFMReportStateBase["error"];

  render() {
    if (this.error === this.props.reportProperties.error)
      return this.component();
    return null;
  }

  abstract component(): JSX.Element | null;
}

export default ErrorConditionBase;
