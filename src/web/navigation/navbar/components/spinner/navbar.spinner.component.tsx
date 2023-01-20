import { Spinner } from "@chakra-ui/react";
import { testIDs } from "./navbar.spinner.identifiers";
import Condition from "@src/components/condition/condition.component";

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
