import { WarningTwoIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ErrorDisplay from "../error.display.component";
import translation from "@locales/main.json";
import Billboard from "@src/components/billboard/billboard.component";
import StyledButton from "@src/components/button/button.standard/button.standard.component";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/components/billboard/billboard.component", () =>
  require("@fixtures/react").createComponent("Billboard")
);

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => {
    const { createComponent } = require("@fixtures/react");
    return createComponent("StyledButton");
  }
);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex"]);
});

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock(["WarningTwoIcon"])
);

describe("ErrorDisplay", () => {
  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);
  const mockReset = jest.fn();
  let translationIndex: string;
  const translatedErrors: { [index: string]: Record<string, string> } =
    translation.errors;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = (error: Error | undefined, errorKey: string) => {
    render(
      <ErrorDisplay errorKey={errorKey} error={error} resetError={mockReset} />
    );
  };

  describe("when an error is given", () => {
    beforeEach(() => {
      translationIndex = "404";
      arrange(mockError, translationIndex);
    });

    it("should render the billboard correctly", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(Billboard, {
        title: _t(translatedErrors[translationIndex].title),
      });
    });

    it("should render the Flex correctly", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        direction: "column",
        align: "center",
        justify: "center",
      });
    });

    it("should render the WarningTwoIcon correctly", () => {
      expect(WarningTwoIcon).toBeCalledTimes(1);
      checkMockCall(WarningTwoIcon, { boxSize: 50, color: "yellow.800" });
    });

    it("should display the error message", async () => {
      expect(await screen.findByText(mockErrorMessage)).toBeTruthy();
    });

    it("should NOT display the translated error message", () => {
      expect(
        screen.queryByText(_t(translatedErrors[translationIndex].message))
      ).toBeNull();
    });

    it("should render the Button correctly", () => {
      expect(StyledButton).toBeCalledTimes(1);
      checkMockCall(StyledButton, { analyticsName: "Clear Error State" });
    });

    it("should display the Button text correctly", async () => {
      expect(
        await screen.findByText(
          _t(translatedErrors[translationIndex].resetButton)
        )
      ).toBeTruthy();
    });

    it("should call the reset function when the Button is pressed", () => {
      expect(StyledButton).toBeCalledTimes(1);
      expect((StyledButton as jest.Mock).mock.calls[0][0].onClick).toBe(
        mockReset
      );
    });
  });

  describe("when there is no error", () => {
    beforeEach(() => {
      translationIndex = "404";
      arrange(undefined, translationIndex);
    });

    it("should render the billboard correctly", () => {
      expect(Billboard).toBeCalledTimes(1);
      checkMockCall(Billboard, {
        title: _t(translatedErrors[translationIndex].title),
      });
    });

    it("should render the Flex correctly", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {
        direction: "column",
        align: "center",
        justify: "center",
      });
    });

    it("should render the WarningTwoIcon correctly", () => {
      expect(WarningTwoIcon).toBeCalledTimes(1);
      checkMockCall(WarningTwoIcon, { boxSize: 50, color: "yellow.800" });
    });

    it("should display the error message", async () => {
      expect(
        await screen.findByText(_t(translatedErrors[translationIndex].message))
      ).toBeTruthy();
    });

    it("should render the Button correctly", () => {
      expect(StyledButton).toBeCalledTimes(1);
      checkMockCall(StyledButton, { analyticsName: "Clear Error State" });
    });

    it("should display the Button text correctly", async () => {
      expect(
        await screen.findByText(
          _t(translatedErrors[translationIndex].resetButton)
        )
      ).toBeTruthy();
    });

    it("should call the reset function when the Button is pressed", () => {
      expect(StyledButton).toBeCalledTimes(1);
      expect((StyledButton as jest.Mock).mock.calls[0][0].onClick).toBe(
        mockReset
      );
    });
  });
});
