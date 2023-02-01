import ErrorConditionBase from "./bases/error.condition.base.class.component";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";

class AuthenticationErrorConditionalDisplay<
  ReportType,
  DrawerProps
> extends ErrorConditionBase<ReportType, DrawerProps> {
  error = "UnauthorizedFetch" as const;

  component = () => <Authentication />;
}

export default AuthenticationErrorConditionalDisplay;
