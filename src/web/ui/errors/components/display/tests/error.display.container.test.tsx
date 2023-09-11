import { render, screen, within } from "@testing-library/react";
import ErrorDisplay from "../error.display.component";
import ErrorDisplayContainer, {
  ErrorDisplayContainerProps,
} from "../error.display.container";
import translations from "@locales/errors.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../error.display.component", () =>
  require("@fixtures/react/parent").createComponent("ErrorDisplay")
);

describe("ErrorDisplayContainer", () => {
  let currentProps: ErrorDisplayContainerProps;

  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);

  const baseProps: ErrorDisplayContainerProps = {
    errorKey: "404",
    handleClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<ErrorDisplayContainer {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkErrorDisplayRender = () => {
    it("should render the ErrorDisplay component with the expected props", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      checkMockCall(
        ErrorDisplay,
        {
          buttonText: _t(translations[currentProps.errorKey].resetButton),
          handleClick: currentProps.handleClick,
          titleText: _t(translations[currentProps.errorKey].title),
        },
        0
      );
    });
  };

  describe("when an error is passed", () => {
    beforeEach(() => {
      currentProps.error = mockError;

      arrange();
    });

    checkErrorDisplayRender();

    it("should render the error message", async () => {
      const element = await screen.findByTestId("ErrorDisplay");
      expect(await within(element).findByText(mockErrorMessage)).toBeTruthy();
    });
  });

  describe("when there is no error", () => {
    beforeEach(() => {
      currentProps.error = undefined;

      arrange();
    });

    it("should render the translation text", async () => {
      const element = await screen.findByTestId("ErrorDisplay");
      expect(
        await within(element).findByText(
          _t(translations[currentProps.errorKey].message)
        )
      ).toBeTruthy();
    });
  });
});
