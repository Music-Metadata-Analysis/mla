import Condition from "../../condition/condition.component";
import ErrorDisplay from "../display/error.display.component";

export interface ErrorHandlerProps {
  children: JSX.Element;
  isTrue: boolean;
  resetError: () => void;
  errorKey: string;
}

const ErrorCondition = ({
  children,
  isTrue,
  errorKey,
  resetError,
}: ErrorHandlerProps) => {
  return (
    <>
      <Condition isTrue={isTrue}>
        <ErrorDisplay errorKey={errorKey} resetError={resetError} />
      </Condition>
      <Condition isTrue={!isTrue}>{children}</Condition>
    </>
  );
};

export default ErrorCondition;
