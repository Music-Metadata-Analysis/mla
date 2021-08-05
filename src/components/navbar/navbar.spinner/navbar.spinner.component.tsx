import { Spinner } from "@chakra-ui/react";
import Condition from "../../condition/condition.component";

export const testIDs = {
  NavBarSpinner: "NavBarSpinner",
};

interface SpinnerProps {
  whileTrue: boolean;
  children: JSX.Element;
}

const NavBarSpinner = ({ whileTrue, children }: SpinnerProps) => {
  return (
    <>
      <Condition isTrue={whileTrue}>
        <Spinner data-testid={testIDs.NavBarSpinner} />
      </Condition>
      <Condition isTrue={!whileTrue}>{children}</Condition>
    </>
  );
};

export default NavBarSpinner;
