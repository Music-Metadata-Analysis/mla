import { WarningTwoIcon } from "@chakra-ui/icons";
import { Flex, Button } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import translation from "../../../../../public/locales/en/main.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Billboard from "../../../billboard/billboard.component";
import ErrorDisplay from "../error.display.component";

jest.mock("../../../billboard/billboard.component", () =>
  createMockedComponent("BillBoard")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex", "Button"]);
});

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.icon.factory.class");
  return factoryInstance.create(["WarningTwoIcon"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("ErrorHandler", () => {
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
        title: translatedErrors[translationIndex].title,
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
        screen.queryByText(translatedErrors[translationIndex].message)
      ).toBeNull();
    });

    it("should render the Button correctly", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, { bg: "gray.500", size: "sm" });
    });

    it("should display the Button text correctly", async () => {
      expect(
        await screen.findByText(translatedErrors[translationIndex].resetButton)
      ).toBeTruthy();
    });

    it("should call the reset function when the Button is pressed", () => {
      expect(Button).toBeCalledTimes(1);
      expect((Button as jest.Mock).mock.calls[0][0].onClick).toBe(mockReset);
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
        title: translatedErrors[translationIndex].title,
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
        await screen.findByText(translatedErrors[translationIndex].message)
      ).toBeTruthy();
    });

    it("should render the Button correctly", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, { bg: "gray.500", size: "sm" });
    });

    it("should display the Button text correctly", async () => {
      expect(
        await screen.findByText(translatedErrors[translationIndex].resetButton)
      ).toBeTruthy();
    });

    it("should call the reset function when the Button is pressed", () => {
      expect(Button).toBeCalledTimes(1);
      expect((Button as jest.Mock).mock.calls[0][0].onClick).toBe(mockReset);
    });
  });
});
