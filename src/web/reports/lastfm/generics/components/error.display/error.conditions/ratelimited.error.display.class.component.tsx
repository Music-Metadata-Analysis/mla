import ErrorConditionBase from "./bases/error.condition.base.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";

class RateLimitedErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "RatelimitedFetch" as const;

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"lastfmRatelimited"}
        handleClick={() => this.props.router.reload()}
      />
    );
  }
}

export default RateLimitedErrorConditionalDisplay;
