import ErrorDisplay from "./error.display.component";
import useLocale from "@src/hooks/locale.hook";
import type errors from "@locales/errors.json";

export interface ErrorDisplayContainerProps {
  error?: Error;
  errorKey: keyof typeof errors;
  handleClick: () => void;
}

const ErrorDisplayContainer = ({
  error,
  errorKey,
  handleClick,
}: ErrorDisplayContainerProps) => {
  const { t } = useLocale("errors");

  const messageText = () => {
    if (error) return error.message;
    return t(`${errorKey}.message`);
  };

  return (
    <ErrorDisplay
      buttonText={t(`${errorKey}.resetButton`)}
      handleClick={handleClick}
      titleText={t(`${errorKey}.title`)}
    >
      {messageText()}
    </ErrorDisplay>
  );
};

export default ErrorDisplayContainer;
