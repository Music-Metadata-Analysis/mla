import ErrorConditionBase from "./bases/error.condition.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class FetchErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
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
