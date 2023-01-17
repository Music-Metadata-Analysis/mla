import { Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import SplashToggle from "../splash.toggle.component";
import Highlight from "@src/components/highlight/highlight.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Container",
    "ListItem",
    "UnorderedList",
  ])
);
jest.mock("@src/components/highlight/highlight.component", () =>
  require("@fixtures/react/parent").createComponent("Highlight")
);

describe("SplashToggle", () => {
  const mockT = new MockUseLocale("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashToggle router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(1);
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

    it("should call Highlight with the correct props (visible by default)", () => {
      expect(Highlight).toBeCalledTimes(1);
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
