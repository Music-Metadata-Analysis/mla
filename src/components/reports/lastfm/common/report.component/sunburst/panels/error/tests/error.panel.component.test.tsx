import { Box, Center, Container } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstErrorPanel, {
  SunBurstErrorPanelProps,
} from "../error.panel.component";
import { testIDs } from "../error.panel.identifiers";
import settings from "@src/config/sunburst";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box", "Center", "Container"])
);

describe("SunBurstErrorPanel", () => {
  let currentProps: SunBurstErrorPanelProps;

  const mockBreakPoints = [100, 200, 300];
  const mockMessage = "This is a test message.";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      breakPoints: mockBreakPoints,
      message: mockMessage,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstErrorPanel {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the Box component as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          mt: `${settings.navbarOffset}px`,
          ml: 1,
          mr: 1,
          borderWidth: 2,
          borderColor: mockColourHook.componentColour.border,
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          w: mockBreakPoints,
        },
        0,
        []
      );
    });

    it("should call the Center component as expected", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(
        Center,
        {
          height: `calc(100vh - ${settings.navbarOffset}px)`,
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
          p: 1,
          textAlign: "center",
          "data-testid": testIDs.SunBurstErrorPanel,
        },
        0,
        []
      );
    });

    it("should display the message on screen", async () => {
      const messageContainer = await screen.findByTestId(
        testIDs.SunBurstErrorPanel
      );
      expect(
        await within(messageContainer).findByText(mockMessage)
      ).toBeTruthy();
    });
  });
});
