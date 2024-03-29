import {
  Progress,
  StatLabel,
  StatHelpText,
  StatNumber,
} from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import BillBoardProgressBar from "../billboard.progress.bar.component";
import { testIDs } from "../billboard.progress.bar.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { truncate } from "@src/utilities/generics/strings";
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";
import BillBoardContainer from "@src/web/ui/generics/components/billboard/billboard.base/billboard.container";
import type { BillBoardProgressBarDetails } from "../billboard.progress.bar.component";

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

jest.mock("@src/utilities/generics/strings");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Progress",
    "StatHelpText",
    "StatLabel",
    "StatNumber",
  ])
);

jest.mock(
  "@src/web/ui/generics/components/billboard/billboard.base/billboard.container",
  () => require("@fixtures/react/parent").createComponent("BillboardContainer")
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
        titleText={testTitle}
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
      expect(BillBoardContainer).toHaveBeenCalledTimes(1);
      checkMockCall(BillBoardContainer, { titleText: testTitle });
    });

    it("should render the details", () => {
      expect(StatNumber).toHaveBeenCalledTimes(1);
      expect(StatNumber).toHaveBeenCalledWith(
        { children: mockValue + "%" },
        {}
      );
      expect(StatLabel).toHaveBeenCalledTimes(1);
      expect(StatLabel).toHaveBeenCalledWith(
        { children: mockDetails.type },
        {}
      );
      expect(StatHelpText).toHaveBeenCalledTimes(1);
      expect(StatHelpText).toHaveBeenCalledWith(
        { children: mockTruncatedString },
        {}
      );
    });

    it("should call truncated with the expected value", () => {
      expect(truncate).toHaveBeenCalledTimes(1);
      expect(truncate).toHaveBeenCalledWith(
        mockDetails.resource,
        expectedMaxLength
      );
    });

    it("should render the progress bar", async () => {
      expect(Progress).toHaveBeenCalledTimes(1);
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
      expect(BillBoardContainer).toHaveBeenCalledTimes(1);
      checkMockCall(BillBoardContainer, { titleText: testTitle });
    });

    it("should render the details", () => {
      expect(StatNumber).toHaveBeenCalledTimes(1);
      expect(StatNumber).toHaveBeenCalledWith(
        { children: mockValue + "%" },
        {}
      );
      expect(StatLabel).toHaveBeenCalledTimes(1);
      expect(StatLabel).toHaveBeenCalledWith(
        { children: mockDetails.type },
        {}
      );
      expect(StatHelpText).toHaveBeenCalledTimes(1);
      expect(StatHelpText).toHaveBeenCalledWith(
        { children: mockTruncatedString },
        {}
      );
    });

    it("should call truncated with the expected value", () => {
      expect(truncate).toHaveBeenCalledTimes(1);
      expect(truncate).toHaveBeenCalledWith(
        mockDetails.resource,
        expectedMaxLength
      );
    });

    it("should render the progress bar", async () => {
      expect(Progress).toHaveBeenCalledTimes(1);
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
