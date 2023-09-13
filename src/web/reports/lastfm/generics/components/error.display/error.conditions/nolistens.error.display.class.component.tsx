import ErrorBase from "./bases/error.base.class.component";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";

class NoListensErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorBase<ReportType, DrawerProps> {
  render() {
    if (this.props.query.queryUserHasNoData(this.props.reportProperties))
      return this.component();
    return null;
  }

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"userWithNoListens"}
        handleClick={() =>
          this.props.router.push(this.props.query.getRetryRoute())
        }
      />
    );
  }
}

export default NoListensErrorConditionalDisplay;
