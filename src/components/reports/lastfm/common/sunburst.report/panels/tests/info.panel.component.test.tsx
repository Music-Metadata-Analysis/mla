import { Text, Box, Container } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import mockColourHook from "../../../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../../../tests/fixtures/mock.component.call";
import SunBurstInfoPanel, {
  SunBurstInfoPanelProps,
  testIDs,
} from "../info.panel.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../../..//tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Text", "Box", "Container"]);
});

jest.mock("../../../../../../..//hooks/colour", () => {
  return () => mockColourHook;
});

describe("SunBurstInfoPanel", () => {
  let currentProps: SunBurstInfoPanelProps;
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
    render(<SunBurstInfoPanel {...currentProps} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the Box component as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          mt: 1,
          mb: 1,
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

    it("should call the Container component as expected", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          p: 1,
          textAlign: "center",
        },
        0,
        []
      );
    });

    it("should call the Text component as expected", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          fontSize: "xs",
          "data-testid": testIDs.SunBurstInfoPanelMessage,
        },
        0,
        []
      );
    });

    it("should display the message on screen", async () => {
      const messageContainer = await screen.findByTestId(
        testIDs.SunBurstInfoPanelMessage
      );
      expect(
        await within(messageContainer).findByText(mockMessage)
      ).toBeTruthy();
    });
  });
});
