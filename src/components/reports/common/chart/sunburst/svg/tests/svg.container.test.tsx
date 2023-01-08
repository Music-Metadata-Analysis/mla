import { render, waitFor, fireEvent } from "@testing-library/react";
import MockSunBurstData from "./data/sunburst.data.set.4.json";
import SunBurstChartSVG from "../svg.class.component";
import SunBurstChartSVGContainer from "../svg.container";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";

jest.mock("../svg.class.component", () =>
  require("@fixtures/react/child").createComponent("SunBurstChartSVG")
);

describe("SunBurstChartSVGContainer", () => {
  let originalHeight: number;

  const mockProps = {
    colourSet: { foreground: "mockColour" },
    data: MockSunBurstData as SunBurstData,
    finishTransition: jest.fn(),
    leafEntity: "albums" as const,
    selectedNode: {} as d3Node,
    setSelectedNode: jest.fn(),
    size: 400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => (originalHeight = window.innerHeight));

  afterAll(() => (window.innerHeight = originalHeight));

  const arrange = () => {
    render(<SunBurstChartSVGContainer {...mockProps} />);
  };

  describe("with a known screen size", () => {
    beforeEach(() => {
      window.innerHeight = 1000;
    });

    describe("when rendered", () => {
      beforeEach(() => {
        arrange();
      });

      it("should render the SunBurstChart component", () => {
        expect(SunBurstChartSVG).toBeCalledTimes(1);
      });

      it("should render the SunBurstChart component with expected props", () => {
        expect(SunBurstChartSVG).toBeCalledWith(
          {
            containerSize: 1000,
            colourSet: mockProps.colourSet,
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
          await waitFor(() => expect(SunBurstChartSVG).toBeCalledTimes(2));
          expect(SunBurstChartSVG).toHaveBeenNthCalledWith(
            2,
            {
              containerSize: 500,
              colourSet: mockProps.colourSet,
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
});
