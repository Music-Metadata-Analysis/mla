import { Box, Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import Toggle from "../about.toggle.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Box",
    "Container",
    "ListItem",
    "UnorderedList",
  ])
);

describe("AboutToggle", () => {
  const mockT = new MockUseLocale("about").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Toggle router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          listStylePosition: "outside",
        },
        0
      );
    });

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          pb: 5,
          pl: 5,
          pr: 5,
          ml: 2,
          fontSize: dialogueSettings.smallTextFontSize,
        },
        0
      );
    });

    it("should call ListItem with the correct props", () => {
      expect(ListItem).toBeCalledTimes(3);
      checkMockCall(
        ListItem,
        {
          p: dialogueSettings.listItemPadding,
        },
        0
      );
      checkMockCall(
        ListItem,
        {
          p: dialogueSettings.listItemPadding,
        },
        1
      );
      checkMockCall(
        ListItem,
        {
          p: dialogueSettings.listItemPadding,
        },
        2
      );
    });

    it("should call UnorderedList with the correct props", () => {
      expect(UnorderedList).toBeCalledTimes(1);
      checkMockCall(UnorderedList, {}, 0);
    });
  });
});
