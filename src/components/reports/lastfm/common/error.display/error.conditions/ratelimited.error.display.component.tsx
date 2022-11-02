import ErrorConditionBase from "./bases/error.condition.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class RateLimitedErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "RatelimitedFetch" as const;

  component() {
    return (
      <ErrorDisplay
        errorKey={"lastfmRatelimited"}
        resetError={() => this.props.router.reload()}
      />
    );
  }
}

export default RateLimitedErrorConditionalDisplay;
