import { Box, Center, Container } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import settings from "../../../../../../../config/sunburst";
import mockColourHook from "../../../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../../../tests/fixtures/mock.component.call";
import SunBurstNotVisiblePanel, {
  SunBurstNotVisiblePanelProps,
  testIDs,
} from "../not.visible.panel.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../..//tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Center", "Container"]);
});

jest.mock("../../../../../../..//hooks/colour", () => {
  return () => mockColourHook;
});

describe("SunBurstNotVisiblePanel", () => {
  let currentProps: SunBurstNotVisiblePanelProps;
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
    render(<SunBurstNotVisiblePanel {...currentProps} />);
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
          "data-testid": testIDs.SunBurstNotVisiblePanelMessage,
        },
        0,
        []
      );
    });

    it("should display the message on screen", async () => {
      const messageContainer = await screen.findByTestId(
        testIDs.SunBurstNotVisiblePanelMessage
      );
      expect(
        await within(messageContainer).findByText(mockMessage)
      ).toBeTruthy();
    });
  });
});
