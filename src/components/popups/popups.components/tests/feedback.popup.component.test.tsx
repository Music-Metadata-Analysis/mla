import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import FeedbackPopUp from "../feedback.popup.component";
import { testIDs } from "../feedback.popup.identifiers";
import ClickLink from "@src/components/clickable/click.link.external/click.link.external.component";
import SVSIconContainer from "@src/components/icons/svs/svs.icon.container";
import DimOnHover from "@src/components/styles/hover.dim/hover.dim.style";
import externalRoutes from "@src/config/external";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@src/hooks/locale.hook");

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

jest.mock("@src/components/styles/hover.dim/hover.dim.style", () =>
  require("@fixtures/react/parent").createComponent("DimOnHover")
);

describe("FeedbackPopUp", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<FeedbackPopUp message={mockMessage} onClose={mockClose} />);
  };

  it("should call Avatar as expected to display the logo", () => {
    expect(Avatar).toBeCalledTimes(1);
    const call = jest.mocked(Avatar).mock.calls[0][0];
    expect(call["data-testid"]).toBe(testIDs.FeedBackDialogueIcon);
    expect(call.width).toStrictEqual(50);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderToString(call.icon!)).toBe(
      renderToString(<SVSIconContainer width={75} height={75} />)
    );
    expect(Object.keys(call).length).toBe(3);
  });

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      bg: mockColourHook.feedbackColour.background,
      borderColor: mockColourHook.feedbackColour.border,
      borderRadius: 20,
      borderWidth: 1,
      color: mockColourHook.feedbackColour.foreground,
      mb: [5, 5, 8],
      "data-testid": testIDs.FeedBackDialogue,
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
