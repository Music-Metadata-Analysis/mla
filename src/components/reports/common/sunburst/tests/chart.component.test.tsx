import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { RefObject, useState, Dispatch } from "react";
import mockDataSet3 from "./fixtures/mock.sunburst.data.3.json";
import mockDataSet4 from "./fixtures/mock.sunburst.data.4.json";
import nullNode from "../../../../../providers/user/reports/sunburst.node.initial";
import { getMockProp } from "../../../../../tests/fixtures/mock.component.props";
import SunBurstChart, { testIDs, SunBurstChartProps } from "../chart.component";
import type {
  SunBurstData,
  d3Node,
} from "../../../../../types/reports/sunburst.types";
import type { SetStateAction } from "react";

type CheckClickProps = {
  title: string;
  expected: SunBurstData;
  percentage: string;
  visibleLabels: Array<string>;
  parentClick?: {
    expected: SunBurstData;
    percentage: string;
    visibleLabels: Array<string>;
  };
  subClick?: CheckClickProps;
};

describe("SunBurstChart", () => {
  const expectedPadding = 10;
  const multiExtension = ".multisnap";

  let instance: SunBurstChart;
  let currentProps: SunBurstChartProps;
  let mockContainerSize: number;
  let mockColourSet: { foreground: string };
  let mockData: SunBurstData;
  let mockLeafEntity: SunBurstData["entity"];
  let mockSelectedNode: d3Node;
  let mockSize: number;
  let mockRef: RefObject<SVGSVGElement>;
  let renderContainer: ReturnType<typeof render>;

  let testContainerSelection: SunBurstChartProps["selectedNode"];
  let testContainerSetSelection: Dispatch<
    SetStateAction<SunBurstChartProps["selectedNode"]>
  >;
  let testContainerUpdateProps: Dispatch<SetStateAction<SunBurstChartProps>>;

  const mockSetSelectedNode = jest.fn((node: d3Node) =>
    act(() => testContainerSetSelection(node))
  );
  const mockFinishTransition = jest.fn();

  beforeEach(() => {
    instance = new SunBurstChart({
      containerSize: 300,
      colourSet: { foreground: "#000000" },
      data: { name: "mockRoot", entity: "root" },
      finishTransition: mockFinishTransition,
      selectedNode: nullNode,
      setSelectedNode: jest.fn(),
      size: 300,
      leafEntity: "tracks" as const,
      svgRef: { current: null },
    });
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      containerSize: mockContainerSize,
      colourSet: mockColourSet,
      data: mockData,
      finishTransition: mockFinishTransition as () => void,
      leafEntity: mockLeafEntity,
      selectedNode: mockSelectedNode,
      setSelectedNode: mockSetSelectedNode as (node: d3Node) => void,
      size: mockSize,
      svgRef: mockRef,
    });

  const TestSunBurstContainer = () => {
    [currentProps, testContainerUpdateProps] = useState(createProps());
    [testContainerSelection, testContainerSetSelection] = useState(
      currentProps.selectedNode
    );

    const patchedState = {
      ...currentProps,
      selectedNode: testContainerSelection,
    };

    return <SunBurstChart {...patchedState} />;
  };

  const withChildren = (data: unknown) => {
    return data as SunBurstData & { children: SunBurstData };
  };

  const arrange = () => {
    mockSelectedNode = nullNode;
    renderContainer = render(<TestSunBurstContainer />);
  };

  const updateProps = (newProps: SunBurstChartProps) =>
    act(() => testContainerUpdateProps(newProps));

  const checkSVG = ({
    expected: { containerSize, size },
  }: {
    expected: { containerSize: number; size: number };
  }) => {
    it("should render the svg element with the expected attributes", async () => {
      const chart = await screen.findByTestId(testIDs.SunBurstChart);
      expect(chart).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg");
      expect(chart).toHaveAttribute("width", String(containerSize));
      expect(chart).toHaveAttribute("style", "font: Helvetica 9px 9px;");
      await waitFor(() =>
        expect(chart).toHaveAttribute(
          "viewBox",
          [
            `-${expectedPadding / 2}`,
            `-${expectedPadding / 2}`,
            `${size + expectedPadding / 2}`,
            `${size + expectedPadding / 2}`,
          ].join(",")
        )
      );
    });
  };

  const checkChartTitle = ({ expected }: { expected: string }) => {
    it(`should display the correct percentage (${expected}) in the center area`, async () => {
      const elements = renderContainer.container.getElementsByClassName(
        "SunburstPercentageDisplay"
      );
      expect(elements[0].innerHTML).toBe(expected);
    });
  };

  const checkClickSequence = ({
    title,
    expected,
    percentage,
    visibleLabels,
    parentClick,
    subClick,
  }: CheckClickProps) => {
    describe(`when clicking on Node '${title}'`, () => {
      let selected: SunBurstData;

      beforeEach(async () => {
        mockSetSelectedNode.mockClear();
        mockFinishTransition.mockClear();

        const element = (
          await screen.findAllByText(title, { exact: false })
        )[0];
        fireEvent.click(element);
      });

      it("should select the clicked Node", async () => {
        expect(mockSetSelectedNode).toBeCalledTimes(1);
        selected = getMockProp({
          mock: mockSetSelectedNode,
          propName: "data",
          call: 0,
        });
        expect(selected).toStrictEqual(expected);
      });

      checkTransition({ transitionType: `Node '${title}'` });
      checkChartTitle({ expected: percentage });
      checkVisibleLabels({ expected: visibleLabels });

      if (subClick) {
        checkClickSequence(subClick);
      }

      if (parentClick) {
        checkClickParent(parentClick);
      }
    });
  };

  const checkClickParent = ({
    expected,
    percentage,
    visibleLabels,
  }: NonNullable<CheckClickProps["parentClick"]>) => {
    describe(`when clicking on the percentage display`, () => {
      let selected: SunBurstData;

      beforeEach(async () => {
        mockSetSelectedNode.mockClear();
        mockFinishTransition.mockClear();

        const element = renderContainer.container.getElementsByClassName(
          "SunburstPercentageDisplay"
        )[0];

        fireEvent.click(element);
      });

      it("should select the parent node", async () => {
        await waitFor(() => expect(mockSetSelectedNode).toBeCalledTimes(1));
        selected = getMockProp({
          mock: mockSetSelectedNode,
          propName: "data",
          call: 0,
        });
        expect(selected).toStrictEqual(expected);
      });

      checkTransition({ transitionType: "parent node" });
      checkChartTitle({ expected: percentage });
      checkVisibleLabels({ expected: visibleLabels });
    });
  };

  const checkColourMode = ({
    expected,
  }: {
    expected: SunBurstChartProps["colourSet"];
  }) => {
    it(`should render the title with the expected colour properties (${expected.foreground})`, () => {
      const element = renderContainer.container.getElementsByClassName(
        "SunburstPercentageDisplay"
      )[0] as SVGTextElement;

      expect(element.style).toHaveProperty("fill", expected.foreground);
    });

    it(`should render the node labels with the expected colour properties (${expected.foreground})`, () => {
      const elements = renderContainer.container.getElementsByClassName(
        "NodeLabel"
      ) as HTMLCollectionOf<SVGTextElement>;

      for (const element of elements) {
        expect(element.style).toHaveProperty("fill", expected.foreground);
      }
    });
  };

  const checkCorrectNodeSelected = ({
    selected,
  }: {
    selected: SunBurstData;
  }) => {
    it("should select the root node after mounting", async () => {
      expect(mockSetSelectedNode).toBeCalledTimes(1);
      const selection = getMockProp({
        mock: mockSetSelectedNode,
        propName: "data",
        call: 0,
      });
      expect(selection).toStrictEqual(selected);
    });
  };

  const checkSnapShot = ({ name }: { name: string }) => {
    it(`should match the snapshot on file: ${name}`, () => {
      expect(renderContainer.container).toMatchSpecificSnapshot(
        name + multiExtension
      );
    });
  };

  const checkTransition = ({ transitionType }: { transitionType: string }) => {
    it(`should trigger the path transition for ${transitionType}`, async () => {
      await waitFor(() => expect(mockFinishTransition).toBeCalledTimes(1));
    });
  };

  const checkVisibleLabels = ({ expected }: { expected: Array<string> }) => {
    it("should have the expected visible NodeLabels", () => {
      const labels: Array<string> = [];
      const elements = renderContainer.container.getElementsByClassName(
        "NodeLabel"
      ) as HTMLCollectionOf<Element & { __data__: undefined | d3Node }>;
      for (const element of elements) {
        if (element.__data__) {
          const d = element.__data__;
          if (instance.isLabelVisible(d.target)) {
            labels.push(d.data.name);
          }
        }
      }
      expect(labels).toStrictEqual(expected);
    });
  };

  describe("with mockDataSet4", () => {
    beforeEach(() => {
      mockContainerSize = 500;
      mockColourSet = { foreground: "#000000" };
      mockData = mockDataSet4 as SunBurstData;
      mockLeafEntity = "tracks";
      mockSize = 300;
      mockRef = { current: null };

      arrange();
    });

    describe("when the component's props change", () => {
      describe("with a colour mode change", () => {
        beforeEach(() => {
          updateProps({
            ...currentProps,
            colourSet: { foreground: "#FFFFFF" },
          });
        });

        checkColourMode({ expected: { foreground: "#FFFFFF" } });
      });

      describe("with a container size change", () => {
        beforeEach(() => {
          updateProps({
            ...currentProps,
            containerSize: 620,
          });
        });

        checkSVG({ expected: { containerSize: 620, size: 300 } });
      });

      describe("with a size change", () => {
        beforeEach(() => {
          updateProps({
            ...currentProps,
            size: 400,
          });
        });

        checkSVG({ expected: { containerSize: 500, size: 400 } });
      });

      describe("with a data set changes to mockDataSet3", () => {
        beforeEach(() => {
          mockSetSelectedNode.mockClear();
          mockFinishTransition.mockClear();
          updateProps({
            ...currentProps,
            data: mockDataSet3 as SunBurstData,
          });
        });

        checkSVG({ expected: { containerSize: 500, size: 300 } });
        checkTransition({ transitionType: "the initial render" });
        checkVisibleLabels({
          expected: ["Other", "Caspian", "Other"],
        });
        checkSnapShot({ name: "multi-snapshots/mockDataSet3" });
        checkColourMode({ expected: { foreground: "#000000" } });
        checkChartTitle({ expected: "100%" });
        checkCorrectNodeSelected({
          selected: mockDataSet3 as SunBurstData,
        });
        checkClickSequence({
          title: "Top Artists/Other",
          expected: withChildren(mockDataSet3).children[1],
          visibleLabels: [],
          percentage: "97.46%",
          parentClick: {
            expected: withChildren(mockDataSet3),
            percentage: "100%",
            visibleLabels: ["Other", "Caspian", "Other"],
          },
        });
      });
    });

    checkSVG({ expected: { containerSize: 500, size: 300 } });
    checkTransition({ transitionType: "the initial render" });
    checkVisibleLabels({
      expected: [
        "Other",
        "Lights & Motion",
        "Caspian",
        "Reanimation",
        "Other",
        "Other",
      ],
    });
    checkSnapShot({ name: "multi-snapshots/mockDataSet4" });
    checkColourMode({ expected: { foreground: "#000000" } });
    checkChartTitle({ expected: "100%" });
    checkCorrectNodeSelected({
      selected: mockDataSet4 as SunBurstData,
    });
    checkClickSequence({
      title: "Top Artists/Other",
      expected: withChildren(mockDataSet4).children[2],
      visibleLabels: [],
      percentage: "94.44%",
      parentClick: {
        expected: withChildren(mockDataSet4),
        percentage: "100%",
        visibleLabels: [
          "Other",
          "Lights & Motion",
          "Caspian",
          "Reanimation",
          "Other",
          "Other",
        ],
      },
    });
    checkClickSequence({
      title: "Top Artists/Lights & Motion",
      expected: withChildren(mockDataSet4).children[0],
      percentage: "3.10%",
      visibleLabels: ["Reanimation", "Other", "Chronicle", "Bloom"],
      subClick: {
        title: "Top Artists/Lights & Motion/Reanimation",
        expected: withChildren(mockDataSet4.children[0]).children[1],
        percentage: "1.46%",
        visibleLabels: [],
        parentClick: {
          expected: withChildren(mockDataSet4).children[0],
          percentage: "3.10%",
          visibleLabels: ["Reanimation", "Other", "Chronicle", "Bloom"],
        },
      },
    });
    checkClickSequence({
      title: "Top Artists/Caspian",
      expected: withChildren(mockDataSet4).children[1],
      percentage: "2.46%",
      visibleLabels: ["Other", "The Four Trees"],
      subClick: {
        title: "Top Artists/Caspian/The Four Trees",
        expected: withChildren(mockDataSet4.children[1]).children[0],
        percentage: "0.09%",
        visibleLabels: [],
        parentClick: {
          expected: withChildren(mockDataSet4).children[1],
          percentage: "2.46%",
          visibleLabels: ["Other", "The Four Trees"],
        },
      },
    });
  });
});
