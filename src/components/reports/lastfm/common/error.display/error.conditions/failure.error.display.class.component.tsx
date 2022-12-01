import ErrorConditionBase from "./bases/error.condition.base.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";

class FetchErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "FailureFetch" as const;

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"lastfmCommunications"}
        handleClick={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default FetchErrorConditionalDisplay;
