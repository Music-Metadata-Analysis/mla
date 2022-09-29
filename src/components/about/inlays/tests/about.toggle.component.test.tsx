import { Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import Toggle from "../about.toggle.component";
import dialogueSettings from "@src/config/dialogue";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Container", "ListItem", "UnorderedList"]);
});

jest.mock("@src/components/icons/svs/svs.icon", () =>
  require("@fixtures/react/child").createComponent("Icon")
);

describe("AboutToggle", () => {
  const mockT = new MockUseLocale("about").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Toggle t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

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
