import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import FeedbackPopUp from "../feedback.popup.component";
import { testIDs } from "../feedback.popup.identifiers";
import { createSimpleComponent } from "@fixtures/react/simple";
import externalRoutes from "@src/config/external";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";
import DimOnHover from "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style";

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

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
  "@src/web/navigation/links/components/click.link.external/click.link.external.component",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

jest.mock(
  "@src/web/ui/generics/components/styles/hover.dim/hover.dim.style",
  () => require("@fixtures/react/parent").createComponent("DimOnHover")
);

describe("FeedbackPopUp", () => {
  const mockClose = jest.fn();
  const mockMessage = "mockMessage";
  const mockIconID = "mockIconID";
  const mockIcon = createSimpleComponent(mockIconID);

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <FeedbackPopUp
        message={mockMessage}
        onClose={mockClose}
        subComponents={{ Icon: mockIcon }}
      />
    );
  };

  it("should call the Avatar correctly to display the icon", () => {
    expect(Avatar).toHaveBeenCalledTimes(1);
    const call = jest.mocked(Avatar).mock.calls[0][0];
    expect((call as { "data-testid": string })["data-testid"]).toBe(
      testIDs.FeedBackDialogueIcon
    );
    expect(call.height).toStrictEqual(50);
    expect(call.width).toStrictEqual(50);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(renderToString(call.icon!)).toBe(renderToString(mockIcon()));
    expect(Object.keys(call).length).toBe(4);
  });

  it("should call the Box component correctly", () => {
    expect(Box).toHaveBeenCalledTimes(1);
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
    expect(CloseIcon).toHaveBeenCalledTimes(1);
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
    expect(DimOnHover).toHaveBeenCalledTimes(2);
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
    expect(Flex).toHaveBeenCalledTimes(1);
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
    expect(Text).toHaveBeenCalledTimes(1);
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
    expect(ClickLink).toHaveBeenCalledTimes(1);
    checkMockCall(ClickLink, {
      href: externalRoutes.svsContact,
    });
  });
});
