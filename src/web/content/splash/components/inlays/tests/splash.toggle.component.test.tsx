import { Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import SplashToggle from "../splash.toggle.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import Highlight from "@src/web/ui/generics/components/highlight/highlight.component";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Container",
    "ListItem",
    "UnorderedList",
  ])
);
jest.mock("@src/web/ui/generics/components/highlight/highlight.component", () =>
  require("@fixtures/react/parent").createComponent("Highlight")
);

describe("SplashToggle", () => {
  const mockT = new MockUseTranslation("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashToggle router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Container with the correct props", () => {
      expect(Container).toHaveBeenCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          p: 5,
          ml: 2,
          fontSize: dialogueSettings.largeTextFontSize,
        },
        0
      );
    });

    it("should call ListItem with the correct props", () => {
      expect(ListItem).toHaveBeenCalledTimes(3);
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
      expect(UnorderedList).toHaveBeenCalledTimes(1);
      checkMockCall(UnorderedList, {}, 0);
    });

    it("should call Highlight with the correct props (visible by default)", () => {
      expect(Highlight).toHaveBeenCalledTimes(1);
      checkMockCall(Highlight, {
        mb: 3,
        borderWidth: "1px",
        style: {
          listStylePosition: "outside",
        },
      });
    });
  });
});
