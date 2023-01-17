import { Text, Box, Container } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstTitlePanel, {
  SunBurstTitlePanelProps,
} from "../title.panel.component";
import { testIDs } from "../title.panel.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Text", "Box", "Container"])
);

describe("SunBurstTitlePanel", () => {
  let currentProps: SunBurstTitlePanelProps;

  const mockBreakPoints = [100, 200, 300];
  const mockTitle = "This is a test title.";
  const mockUserName = "mock-user";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      breakPoints: mockBreakPoints,
      title: mockTitle,
      userName: mockUserName,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstTitlePanel {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the Box component as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          mb: 1,
          borderWidth: 1,
          borderColor: mockColourHook.componentColour.border,
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          w: mockBreakPoints,
        },
        0,
        []
      );
    });

    it("should call the Container component as expected", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          textAlign: "center",
          sx: { caretColor: mockColourHook.transparent },
        },
        0,
        []
      );
    });

    it("should call the Text component as expected", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          fontSize: ["xl", "2xl", "3xl"],
          "data-testid": testIDs.SunBurstTitlePanelUserName,
        },
        0,
        []
      );
      checkMockCall(
        Text,
        {
          fontSize: ["l", "xl", "2xl"],
          "data-testid": testIDs.SunBurstTitlePanelTitle,
        },
        1,
        []
      );
    });

    it("should display the title on screen", async () => {
      const titleContainer = await screen.findByTestId(
        testIDs.SunBurstTitlePanelTitle
      );
      expect(await within(titleContainer).findByText(mockTitle)).toBeTruthy();
    });

    it("should display the user name on screen", async () => {
      const userNameContainer = await screen.findByTestId(
        testIDs.SunBurstTitlePanelUserName
      );
      expect(
        await within(userNameContainer).findByText(mockUserName)
      ).toBeTruthy();
    });
  });
});
