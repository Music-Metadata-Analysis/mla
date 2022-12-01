import ErrorBase from "./bases/error.base.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";

class NoListensErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorBase<ReportType, DrawerProps> {
  render() {
    if (this.props.report.queryUserHasNoData(this.props.userProperties))
      return this.component();
    return null;
  }

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"userWithNoListens"}
        handleClick={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default NoListensErrorConditionalDisplay;
