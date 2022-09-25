import ConditionalErrorDisplayBase from "./error.condition.display.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class FetchErrorConditionalDisplay<
  ReportType
> extends ConditionalErrorDisplayBase<ReportType> {
  error = "FailureFetch" as const;

  component() {
    return (
      <ErrorDisplay
        errorKey={"lastfmCommunications"}
        resetError={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default FetchErrorConditionalDisplay;
