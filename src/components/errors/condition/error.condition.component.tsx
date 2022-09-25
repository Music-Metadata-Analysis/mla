import ErrorDisplay from "../display/error.display.component";
import Condition from "@src/components/condition/condition.component";

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
