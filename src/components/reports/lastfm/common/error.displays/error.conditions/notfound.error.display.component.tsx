import ConditionalErrorDisplayBase from "./error.condition.display.base.class";
import ErrorDisplay from "@src/components/errors/display/error.display.component";

class NotFoundErrorConditionalDisplay<
  ReportType
> extends ConditionalErrorDisplayBase<ReportType> {
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
