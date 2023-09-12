import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ReportIndicator from "../report.indicator.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("ReportIndicator", () => {
  let visible: boolean;

  const mockIndicatorText = "mockIndicatorText";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <ReportIndicator visible={visible} indication={mockIndicatorText} />
    );
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
