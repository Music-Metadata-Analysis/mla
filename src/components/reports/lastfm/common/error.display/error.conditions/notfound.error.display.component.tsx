import ErrorConditionBase from "./bases/error.condition.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class NotFoundErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "NotFoundFetch" as const;

  component() {
    return (
      <ErrorDisplay
        errorKey={"userNotFound"}
        resetError={() =>
          this.props.router.push(this.props.report.getRetryRoute())
        }
      />
    );
  }
}

export default NotFoundErrorConditionalDisplay;
