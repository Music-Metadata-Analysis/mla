import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import externalRoutes from "../../../../config/external";
import mockColourHook from "../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import ClickLink from "../../../clickable/click.link.external/click.link.external.component";
import SVSIcon from "../../../icons/svs/svs.icon";
import DimOnHover from "../../../styles/hover.dim/hover.dim.styles";
import FeedbackDialogue, { testIDs } from "../feedback.dialogue";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  const instance = factoryInstance.create(["Avatar", "Box", "Flex", "Text"]);
  return instance;
});

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.icon.factory.class");
  const instance = factoryInstance.create(["CloseIcon"]);
  return instance;
});

jest.mock("../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock(
  "../../../clickable/click.link.external/click.link.external.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("FeedbackDialogue", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<FeedbackDialogue message={mockMessage} onClose={mockClose} />);
  };

  it("should call Avatar as expected to display the logo", () => {
    expect(Avatar).toBeCalledTimes(1);
    const call = (Avatar as jest.Mock).mock.calls[0][0];
    expect(call["data-testid"]).toBe(testIDs.FeedBackDialogueIcon);
    expect(call.width).toStrictEqual(50);
    expect(renderToString(call.icon)).toBe(
      renderToString(<SVSIcon width={75} height={75} />)
    );
    expect(Object.keys(call).length).toBe(3);
  });

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      mb: [5, 5, 8],
      bg: mockColourHook.feedbackColour.background,
      color: mockColourHook.feedbackColour.foreground,
      borderColor: mockColourHook.feedbackColour.border,
      borderWidth: 1,
      borderRadius: 20,
    });
  });

  it("should call the CloseIcon component correctly", () => {
    expect(CloseIcon).toBeCalledTimes(1);
    checkMockCall(
      CloseIcon,
      {
        "data-testid": testIDs.FeedBackDialogueCloseButton,
        height: 4,
        mb: 2,
        width: 4,
      },
      0
    );
  });

  it("should call the DimOnHover component correctly", () => {
    expect(DimOnHover).toBeCalledTimes(2);
    checkMockCall(
      DimOnHover,
      {
        ml: 2,
        mb: 2,
      },
      0
    );
    checkMockCall(
      DimOnHover,
      {
        pr: 2,
      },
      1
    );
  });

  it("should call the Flex component correctly", () => {
    expect(Flex).toBeCalledTimes(1);
    checkMockCall(
      Flex,
      {
        align: "center",
        justify: "center",
        mt: 2,
      },
      0
    );
  });

  it("should call the Text component correctly", () => {
    expect(Text).toBeCalledTimes(1);
    checkMockCall(
      Text,
      {
        ml: 2,
        mb: 2,
        mr: 2,
        fontSize: ["sm", "sm", "l"],
      },
      0
    );
  });

  it("should call the ClickLink component correctly", () => {
    expect(ClickLink).toBeCalledTimes(1);
    checkMockCall(ClickLink, {
      href: externalRoutes.svsContact,
    });
  });
});
