import { render } from "@testing-library/react";
import SunBurstEntityNodeList from "../node.list.component";
import SunBurstEntityNodeListContainer, {
  SunBurstEntityNodeListContainerProps,
} from "../node.list.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import SunBurstNodeButton from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.button/node.button.component";
import SunBurstNodeDisplay from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.display/node.display.component";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";
import type { SunBurstDrawerNodeComponentProps } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { FC } from "react";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("../node.list.component", () =>
  require("@fixtures/react/parent").createComponent("NodeListComponent")
);

describe("SunBurstEntityNodeListContainer", () => {
  let currentProps: SunBurstEntityNodeListContainerProps;

  const mockScrolLRef = { current: null, value: "mock" };

  const mockLastFMt = new MockUseTranslation("lastfm").t;
  const mockSelectNode = jest.fn();
  const mockSunBurstT = new MockUseTranslation("sunburst").t;

  const baseProps = {
    node: new MockSunBurstNodeAbstractBase({} as d3Node),
    scrollRef: mockScrolLRef,
    selectChildNode: mockSelectNode,
    svgTransition: false,
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

  const createMockNode = (data: unknown) => {
    currentProps.node = new MockSunBurstNodeAbstractBase(data as d3Node);
  };

  const resetProps = () => {
    jest
      .mocked(useTranslation)
      .mockReturnValueOnce({ t: mockLastFMt })
      .mockReturnValueOnce({ t: mockSunBurstT });

    currentProps = { ...baseProps };
  };

  const arrange = () => {
    render(<SunBurstEntityNodeListContainer {...currentProps} />);
  };

  const checkNodeListComponentProps = ({
    expectedEntityComponent,
    expectedTitleText,
  }: {
    expectedEntityComponent: FC<SunBurstDrawerNodeComponentProps>;
    expectedTitleText: string | null;
  }) => {
    it("should render the SunBurstEntityNodeList with the correct props", () => {
      expect(SunBurstEntityNodeList).toBeCalledTimes(1);
      checkMockCall(
        SunBurstEntityNodeList,
        {
          EntityComponent: expectedEntityComponent,
          node: currentProps.node,
          scrollRef: currentProps.scrollRef,
          selectChildNode: currentProps.selectChildNode,
          svgTransition: currentProps.svgTransition,
          titleText: expectedTitleText,
        },
        0
      );
    });
  };

  const checkNodeListComponentNotCalledProps = () => {
    it("should NOT render the SunBurstEntityNodeList component", () => {
      expect(SunBurstEntityNodeList).toBeCalledTimes(0);
    });
  };

  describe("when svgTransition is false", () => {
    beforeEach(() => (currentProps.svgTransition = false));

    describe("when a node is selected with no children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioOneRootNodeWithNoChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentProps({
          expectedEntityComponent: SunBurstNodeButton,
          expectedTitleText: mockLastFMt(
            "playCountByArtist.drawer.noInformation"
          ),
        });
      });
    });

    describe("when a root node is selected, and there are non-leaf children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioTwoRootNodeWithNonLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentProps({
          expectedEntityComponent: SunBurstNodeButton,
          expectedTitleText: new MockSunBurstNodeAbstractBase(
            mockScenarioTwoRootNodeWithNonLeafChildren
          ).getDrawerListTitle(),
        });
      });
    });

    describe("when a node is selected, and there are leaf children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioThreeRootNodeWithLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentProps({
          expectedEntityComponent: SunBurstNodeDisplay,
          expectedTitleText: new MockSunBurstNodeAbstractBase(
            mockScenarioThreeRootNodeWithLeafChildren
          ).getDrawerListTitle(),
        });
      });
    });
  });

  describe("when svgTransition is true", () => {
    beforeEach(() => (currentProps.svgTransition = true));

    describe("when a node is selected with no children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioOneRootNodeWithNoChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentNotCalledProps();
      });
    });

    describe("when a root node is selected, and there are non-leaf children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioTwoRootNodeWithNonLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentNotCalledProps();
      });
    });

    describe("when a node is selected, and there are leaf children present", () => {
      beforeEach(() => {
        createMockNode(mockScenarioThreeRootNodeWithLeafChildren);
      });

      describe("when rendered", () => {
        beforeEach(() => arrange());

        checkNodeListComponentNotCalledProps();
      });
    });
  });
});
