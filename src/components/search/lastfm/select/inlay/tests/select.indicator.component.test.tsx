import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import checkMockCall from "../../../../../../tests/fixtures/mock.component.call";
import Indicator from "../select.indicator.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box"]);
});

describe("SearchSelectionIndicator", () => {
  const mockIndicatorText = "mockIndicatorText";
  let visible: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<Indicator visible={visible} indication={mockIndicatorText} />);
  };

  describe("when indicators are visible", () => {
    beforeEach(() => {
      visible = true;
      arrange();
    });

    it("should display the indicator text", async () => {
      expect(await screen.findByText(mockIndicatorText + ":")).toBeTruthy();
    });

    it("should render the Box component with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {
        mr: 5,
      });
    });
  });

  describe("when indicators are NOT visible", () => {
    beforeEach(() => {
      visible = false;
      arrange();
    });

    it("should NOT display the indicator text", () => {
      expect(screen.queryByText(mockIndicatorText + ":")).toBeNull();
    });

    it("should NOT render the Box component", () => {
      expect(Box).toBeCalledTimes(0);
    });
  });
});
