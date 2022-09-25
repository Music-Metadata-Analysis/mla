import ConditionalErrorDisplayBase from "./error.condition.display.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class RateLimitedErrorConditionalDisplay<
  ReportType
> extends ConditionalErrorDisplayBase<ReportType> {
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
