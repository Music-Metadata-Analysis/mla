import { render, waitFor, fireEvent } from "@testing-library/react";
import MockSunBurstData from "./data/sunburst.data.set.4.json";
import SunBurstChartContainer from "../chart.container";
import SunBurstChart from "@src/components/reports/common/sunburst/chart.component";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import type { d3Node, SunBurstData } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/colour");

jest.mock("../chart.component", () =>
  require("@fixtures/react/child").createComponent("ChartComponent")
);

describe("SunBurstChartContainer", () => {
  let visible: boolean;
  const originalHeight = window.innerHeight;

  const mockProps = {
    data: MockSunBurstData as SunBurstData,
    finishTransition: jest.fn(),
    leafEntity: "albums" as const,
    selectedNode: {} as d3Node,
    setSelectedNode: jest.fn(),
    size: 400,
  };

  beforeEach(() => {
    window.innerHeight = 1000;
    jest.clearAllMocks();
  });

  afterAll(() => (window.innerHeight = originalHeight));

  const arrange = () => {
    render(<SunBurstChartContainer {...{ ...mockProps, visible: visible }} />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the SunBurstChart component", () => {
      expect(SunBurstChart).toBeCalledTimes(1);
    });

    it("should render the SunBurstChart component with expected props", () => {
      expect(SunBurstChart).toBeCalledWith(
        {
          containerSize: 1000,
          colourSet: {
            foreground: mockColourHook.utilities.colourToCSS(
              mockColourHook.sunBurstColour.foreground
            ),
          },
          finishTransition: mockProps.finishTransition,
          leafEntity: mockProps.leafEntity,
          selectedNode: mockProps.selectedNode,
          setSelectedNode: mockProps.setSelectedNode,
          svgRef: { current: null },
          size: mockProps.size,
          data: mockProps.data,
        },
        {}
      );
    });

    describe("when the screen size changes", () => {
      beforeEach(() => {
        window.innerHeight = 500;
        fireEvent.resize(window);
      });

      it("should rerender the SunBurstChart component", async () => {
        await waitFor(() => expect(SunBurstChart).toBeCalledTimes(2));
        expect(SunBurstChart).toHaveBeenNthCalledWith(
          2,
          {
            containerSize: 500,
            colourSet: {
              foreground: mockColourHook.utilities.colourToCSS(
                mockColourHook.sunBurstColour.foreground
              ),
            },
            finishTransition: mockProps.finishTransition,
            leafEntity: mockProps.leafEntity,
            selectedNode: mockProps.selectedNode,
            setSelectedNode: mockProps.setSelectedNode,
            svgRef: { current: null },
            size: mockProps.size,
            data: mockProps.data,
          },
          {}
        );
      });
    });
  });
});
