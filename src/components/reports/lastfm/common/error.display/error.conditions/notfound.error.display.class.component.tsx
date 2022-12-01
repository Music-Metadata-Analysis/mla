import ErrorConditionBase from "./bases/error.condition.base.class.component";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";

class NotFoundErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "NotFoundFetch" as const;

  component() {
    return (
      <ErrorDisplayContainer
        errorKey={"userNotFound"}
        handleClick={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default NotFoundErrorConditionalDisplay;
