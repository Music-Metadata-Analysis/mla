import ErrorConditionBase from "./bases/error.condition.base.class.component";
import Authentication from "@src/components/authentication/authentication.container";

class AuthenticationErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "UnauthorizedFetch" as const;

  component = () => <Authentication />;
}

export default AuthenticationErrorConditionalDisplay;
