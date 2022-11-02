import ConditionalErrorBase from "./bases/condition.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class NoListensErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ConditionalErrorBase<ReportType, DrawerProps> {
  render() {
    if (this.props.report.queryUserHasNoData(this.props.userProperties))
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
