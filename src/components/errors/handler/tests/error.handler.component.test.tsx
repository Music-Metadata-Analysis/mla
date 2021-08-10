import { WarningTwoIcon } from "@chakra-ui/icons";
import { Flex, Button } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import translation from "../../../../../public/locales/en/main.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import Billboard from "../../../billboard/billboard.component";
import ErrorHandler from "../error.handler.component";

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

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

describe("ErrorHandler", () => {
  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);
  const mockReset = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error");
    consoleErrorSpy.mockImplementation(() => null);
    arrange();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const arrange = () => {
    render(<ErrorHandler error={mockError} resetErrorBoundary={mockReset} />);
  };

  it("should log the error", () => {
    expect(consoleErrorSpy).toBeCalledTimes(1);
    expect(consoleErrorSpy).toBeCalledWith(mockError);
  });

  it("should render the billboard correctly", () => {
    expect(Billboard).toBeCalledTimes(1);
    checkMockCall(Billboard, { title: translation.error.title });
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

  it("should render the Button correctly", () => {
    expect(Button).toBeCalledTimes(1);
    checkMockCall(Button, { bg: "gray.500", size: "sm" });
  });

  it("should call the reset function when the Button is pressed", () => {
    expect(Button).toBeCalledTimes(1);
    expect((Button as jest.Mock).mock.calls[0][0].onClick).toBe(mockReset);
  });
});
