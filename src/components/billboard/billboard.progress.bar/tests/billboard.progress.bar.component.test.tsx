import {
  Progress,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import BillBoard from "../../billboard.component";
import BillBoardProgressBar, {
  testIDs,
} from "../billboard.progress.bar.component";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { truncate } from "@src/utils/strings";
import type { BillBoardProgressBarDetails } from "../billboard.progress.bar.component";

jest.mock("@src/hooks/colour");

jest.mock("@src/utils/strings");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock([
    "Progress",
    "StatHelpText",
    "StatLabel",
    "StatNumber",
  ]);
});

jest.mock("../../billboard.component", () =>
  require("@fixtures/react/parent").createComponent("Billboard")
);

describe("BillBoardProgressBar", () => {
  let isVisible: boolean;
  let mockDetails: BillBoardProgressBarDetails;
  const mockResource = "abcdefghijklmnopqr";
  const testTitle = "Test Title";
  const mockValue = 72;
  const expectedMaxLength = 18;
  const mockTruncatedString = `truncate@${expectedMaxLength}(${mockResource})`;

  const arrange = () => {
    render(
      <BillBoardProgressBar
        value={mockValue}
        details={mockDetails}
        visible={isVisible}
        title={testTitle}
      />
    );
  };

  const progressBarProps = () => ({
    "data-testid": testIDs.BillBoardProgressBar,
    height: "32px",
    colorScheme: mockColourHook.componentColour.scheme,
    value: mockValue,
    color: mockColourHook.componentColour.foreground,
    bgColor: mockColourHook.componentColour.background,
  });

  beforeEach(() => jest.clearAllMocks());

  describe("visible is true", () => {
    beforeEach(() => {
      isVisible = true;
      mockDetails = { type: "Album Details", resource: "abcdefghijklmnopqr" };
      arrange();
    });

    it("should render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(1);
      checkMockCall(BillBoard, { title: testTitle });
    });

    it("should render the details", () => {
      expect(StatNumber).toBeCalledTimes(1);
      expect(StatNumber).toBeCalledWith({ children: mockValue + "%" }, {});
      expect(StatLabel).toBeCalledTimes(1);
      expect(StatLabel).toBeCalledWith({ children: mockDetails.type }, {});
      expect(StatHelpText).toBeCalledTimes(1);
      expect(StatHelpText).toBeCalledWith(
        { children: mockTruncatedString },
        {}
      );
    });

    it("should call truncated with the expected value", () => {
      expect(truncate).toBeCalledTimes(1);
      expect(truncate).toBeCalledWith(mockDetails.resource, expectedMaxLength);
    });

    it("should render the progress bar", async () => {
      expect(Progress).toBeCalledTimes(1);
      checkMockCall(Progress, progressBarProps());
    });

    it("should render the progress bar as visible", async () => {
      const progressBar = await screen.findByTestId(
        testIDs.BillBoardProgressBarVisibilityControl
      );
      expect(progressBar).toBeVisible();
    });
  });

  describe("visible is false", () => {
    beforeEach(() => {
      isVisible = false;
      mockDetails = { type: "Album Details", resource: "abcdefghijklmnopqr" };
      arrange();
    });

    it("should render the billboard", () => {
      expect(BillBoard).toBeCalledTimes(1);
      checkMockCall(BillBoard, { title: testTitle });
    });

    it("should render the details", () => {
      expect(StatNumber).toBeCalledTimes(1);
      expect(StatNumber).toBeCalledWith({ children: mockValue + "%" }, {});
      expect(StatLabel).toBeCalledTimes(1);
      expect(StatLabel).toBeCalledWith({ children: mockDetails.type }, {});
      expect(StatHelpText).toBeCalledTimes(1);
      expect(StatHelpText).toBeCalledWith(
        { children: mockTruncatedString },
        {}
      );
    });

    it("should call truncated with the expected value", () => {
      expect(truncate).toBeCalledTimes(1);
      expect(truncate).toBeCalledWith(mockDetails.resource, expectedMaxLength);
    });

    it("should render the progress bar", async () => {
      expect(Progress).toBeCalledTimes(1);
      checkMockCall(Progress, progressBarProps());
    });

    it("should render the progress bar as NOT visible", async () => {
      const progressBar = await screen.findByTestId(
        testIDs.BillBoardProgressBarVisibilityControl
      );
      expect(progressBar).not.toBeVisible();
    });
  });
});
