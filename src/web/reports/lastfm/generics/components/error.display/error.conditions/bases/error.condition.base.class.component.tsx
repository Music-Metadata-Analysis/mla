import ErrorBase from "./error.base.class.component";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

abstract class ErrorConditionBase<ReportType, DrawerProps> extends ErrorBase<
  ReportType,
  DrawerProps
> {
  abstract error: LastFMUserStateBase["error"];

  render() {
    if (this.error === this.props.userProperties.error) return this.component();
    return null;
  }

  abstract component(): JSX.Element | null;
}

export default ErrorConditionBase;
