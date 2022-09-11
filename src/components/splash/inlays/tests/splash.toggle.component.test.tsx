import { Container, ListItem, UnorderedList } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../public/locales/en/splash.json";
import dialogueSettings from "../../../../config/dialogue";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../tests/fixtures/mock.translation";
import Highlight from "../../../highlight/highlight.component";
import SplashToggle from "../splash.toggle.component";

jest.mock("../../../highlight/highlight.component", () =>
  createMockedComponent("Highlight")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Container", "ListItem", "UnorderedList"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SplashToggle", () => {
  const mockT = jest.fn((key) => tLookup(key, translations));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashToggle t={mockT} />);
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
