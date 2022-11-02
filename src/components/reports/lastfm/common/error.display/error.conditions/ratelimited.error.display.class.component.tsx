import ErrorConditionBase from "./bases/error.condition.base.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.component";

class RateLimitedErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "RatelimitedFetch" as const;

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"lastfmRatelimited"}
        resetError={() => this.props.router.reload()}
      />
    );
  }
}

export default RateLimitedErrorConditionalDisplay;
