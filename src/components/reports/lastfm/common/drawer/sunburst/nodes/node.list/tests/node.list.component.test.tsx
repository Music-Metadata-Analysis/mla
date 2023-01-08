import { Flex, Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import SunBurstEntityNodeList, {
  SunBurstEntityNodeListProps,
} from "../node.list.component";
import { ids, testIDs } from "../node.list.identifiers";
import SunBurstNodeButton from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.button/node.button.component";
import SunBurstNodeDisplay from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.display/node.display.component";
import MockSunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex", "Text"])
);

jest.mock(
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "VerticalScrollBarContainer"
    )
);

jest.mock(
  "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.button/node.button.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstNodeButton")
);

jest.mock(
  "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.display/node.display.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstNodeDisplay")
);

describe("SunBurstEntityNodeList", () => {
  let currentProps: SunBurstEntityNodeListProps;

  const mockScrolLRef = { current: null, value: "mock" };

  const mockSelectNode = jest.fn();

  const baseProps: SunBurstEntityNodeListProps = {
    node: new MockSunBurstNodeAbstractBase({} as d3Node),
    scrollRef: mockScrolLRef,
    selectChildNode: mockSelectNode,
    svgTransition: false,
    EntityComponent: SunBurstNodeDisplay,
    titleText: "mockTitleText",
  };

  const mockScenarioOneRootNodeWithNoChildren = {
    data: { name: "Mock Root", entity: "root" },
    value: 100,
  } as d3Node;

  const mockScenarioTwoRootNodeWithNonLeafChildren = {
    data: { name: "Mock Root", entity: "root" },
    children: [
      {
        data: {
          name: "Artist1",
          entity: "artists",
        },
        value: 50,
        children: [
          { data: { name: "Album1", entity: "albums" }, value: 25 },
          { data: { name: "Album2", entity: "albums" }, value: 25 },
        ],
      },
      {
        data: {
          name: "Artist2",
          entity: "artists",
        },
        value: 50,
        children: [
          { data: { name: "Album1", entity: "albums" }, value: 25 },
          { data: { name: "Album2", entity: "albums" }, value: 25 },
        ],
      },
    ],
    value: 100,
  } as d3Node;

  const mockScenarioThreeRootNodeWithLeafChildren = {
    data: {
      name: "Album1",
      entity: "albums",
    },
    children: [
      { data: { name: "Track1", entity: "tracks" } },
      { data: { name: "Track2", entity: "tracks" } },
    ],
    value: 50,
    parent: {
      data: { name: "Artist1", entity: "artists" },
      value: 100,
    },
  } as d3Node;

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const createMockNode = (data: unknown) =>
    (currentProps.node = new MockSunBurstNodeAbstractBase(data as d3Node));

  const resetProps = () => (currentProps = { ...baseProps });

  const arrange = () => {
    render(<SunBurstEntityNodeList {...currentProps} />);
  };

  const checkChakraTextProps = () => {
    it("should render the chakra Text component with the expected props", () => {
      expect(Text).toBeCalledTimes(1);

      checkMockCall(
        Text,
        {
          "data-testid": testIDs.SunBurstEntityNodeListTitle,
          mb: "10px",
          fontSize: "sm",
        },
        0,
        []
      );
    });
  };

  const checkChakraFlexProps = () => {
    it("should render the chakra Flex component with the expected props", () => {
      expect(Flex).toBeCalledTimes(1);

      checkMockCall(
        Flex,
        {
          "data-testid": testIDs.SunBurstEntityNodeList,
          flexDirection: "column",
        },
        0,
        []
      );
    });
  };

  const checkTextContent = () => {
    it("should render the entity list's title text as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstEntityNodeListTitle
      );

      expect(
        await within(container).findByText(currentProps.titleText)
      ).toBeTruthy();
    });
  };

  const checkScrollBarProps = () => {
    it("should render the VerticalScrollBar component with the expected", () => {
      expect(VerticalScrollBarContainer).toBeCalledTimes(1);
      checkMockCall(
        VerticalScrollBarContainer,
        {
          scrollRef: currentProps.scrollRef,
          update: currentProps.node,
          horizontalOffset: 10,
          verticalOffset: 0,
          zIndex: 5000,
        },
        0
      );
    });
  };

  const checkScrollBarDiv = () => {
    it("should render a div element for the VerticalScrollBar component", () => {
      const div = document.getElementById(
        ids.SunburstDrawerEntityListScrollArea
      );
      expect(div).toHaveClass("scrollbar");
      expect(currentProps.scrollRef.current).toBe(div);
    });
  };

  const checkEntityComponent = ({ count }: { count: number }) => {
    it("should render the EntityComponent with the expected props", () => {
      const childNodes = currentProps.node.getChildren();
      expect(childNodes.length).toBe(count);

      expect(currentProps.EntityComponent).toBeCalledTimes(count);
      for (let index = 0; index < count; index++) {
        checkMockCall(
          currentProps.EntityComponent,
          {
            index: index,
            node: currentProps.node.getChildren()[index],
            selectChildNode: mockSelectNode,
          },
          index,
          [],
          false,
          [{ name: "node", class: MockSunBurstNodeAbstractBase }]
        );
      }
    });
  };

  describe("when svgTransition is false", () => {
    beforeEach(() => (currentProps.svgTransition = false));

    describe("when a node is selected with no children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeButton;
        createMockNode(mockScenarioOneRootNodeWithNoChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 0 });
      });
    });

    describe("when a root node is selected, and there are non-leaf children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeButton;
        createMockNode(mockScenarioTwoRootNodeWithNonLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 2 });
      });
    });

    describe("when a node is selected, and there are leaf children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeDisplay;
        createMockNode(mockScenarioThreeRootNodeWithLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 2 });
      });
    });
  });

  describe("when svgTransition is true", () => {
    beforeEach(() => (currentProps.svgTransition = true));

    describe("when a node is selected with no children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeButton;
        createMockNode(mockScenarioOneRootNodeWithNoChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 0 });
      });
    });

    describe("when a root node is selected, and there are non-leaf children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeButton;
        createMockNode(mockScenarioTwoRootNodeWithNonLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 2 });
      });
    });

    describe("when a node is selected, and there are leaf children present", () => {
      beforeEach(() => {
        currentProps.EntityComponent = SunBurstNodeDisplay;
        createMockNode(mockScenarioThreeRootNodeWithLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkChakraTextProps();
        checkChakraFlexProps();
        checkTextContent();
        checkScrollBarProps();
        checkScrollBarDiv();

        checkEntityComponent({ count: 2 });
      });
    });
  });
});
