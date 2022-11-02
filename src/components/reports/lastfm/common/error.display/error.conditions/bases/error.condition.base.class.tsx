import ErrorDisplayConditionBase from "./condition.base.class";
import type { LastFMUserStateBase } from "@src/types/user/state.types";

abstract class ConditionalErrorDisplayBase<
  ReportType,
  DrawerProps
> extends ErrorDisplayConditionBase<ReportType, DrawerProps> {
  abstract error: LastFMUserStateBase["error"];

  render() {
    if (this.error === this.props.userProperties.error) return this.component();
    return null;
  }

  abstract component(): JSX.Element | null;
}

export default ConditionalErrorDisplayBase;
