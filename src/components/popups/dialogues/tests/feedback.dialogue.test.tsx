import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import FeedbackDialogue, { testIDs } from "../feedback.dialogue";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIcon from "@src/components/icons/svs/svs.icon";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.styles";
import externalRoutes from "@src/config/external";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/colour");

jest.mock("@src/hooks/locale");

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock(["CloseIcon"])
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Avatar",
    "Box",
    "Flex",
    "Text",
  ])
);

jest.mock(
  "@src/components/clickable/click.link.external/click.link.external.component",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

jest.mock("@src/components/styles/hover.dim/hover.dim.styles", () =>
  require("@fixtures/react/parent").createComponent("DimOnHover")
);

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
    const call = jest.mocked(Avatar).mock.calls[0][0];
    expect(call["data-testid"]).toBe(testIDs.FeedBackDialogueIcon);
    expect(call.width).toStrictEqual(50);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderToString(call.icon!)).toBe(
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
