import ConditionalErrorBase from "./condition.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class NoListensErrorConditionalDisplay<
  ReportType
> extends ConditionalErrorBase<ReportType> {
  render() {
    if (!this.props.report.queryUserHasData(this.props.userProperties))
      return this.component();
    return null;
  }

  component() {
    return (
      <ErrorDisplay
        errorKey={"userWithNoListens"}
        resetError={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default NoListensErrorConditionalDisplay;
