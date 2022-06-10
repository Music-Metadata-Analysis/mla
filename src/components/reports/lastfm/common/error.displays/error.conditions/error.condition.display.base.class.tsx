import ErrorDisplayConditionBase from "./condition.base.class";
import type { LastFMUserStateBase } from "../../../../../../types/user/state.types";

abstract class ConditionalErrorDisplayBase<
  ReportType
> extends ErrorDisplayConditionBase<ReportType> {
  abstract error: LastFMUserStateBase["error"];

  render() {
    if (this.error === this.props.userProperties.error) return this.component();
    return null;
  }

  abstract component(): JSX.Element | null;
}

export default ConditionalErrorDisplayBase;
