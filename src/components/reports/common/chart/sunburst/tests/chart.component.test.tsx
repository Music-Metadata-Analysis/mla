import { Box, Center } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import SunBurstChart, { SunBurstChartProps } from "../chart.component";
import SunBurstChartSVGContainer from "@src/components/reports/common/chart/sunburst/svg/svg.container";
import settings from "@src/config/sunburst";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box", "Center"])
);

jest.mock(
  "@src/components/reports/common/chart/sunburst/svg/svg.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "SunBurstChartSVGContainer"
    )
);

describe("SunBurstChart", () => {
  let currentProps: SunBurstChartProps;

  const mockLeafEntity = "tracks";
  const mockNode = { value: 100, data: { name: "mockNode" } } as d3Node;
  const mockSunburstData = {
    value: 100,
    name: "mockRoot ",
    entity: "root" as const,
  };

  const mockNodeSelector = jest.fn();
  const mockFinishTransition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      breakPoints: [100, 200, 300, 400],
      data: mockSunburstData,
      leafEntity: mockLeafEntity,
      finishTransition: mockFinishTransition,
      selectedNode: mockNode,
      setSelectedNode: mockNodeSelector,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstChart {...currentProps} />);
  };

  const checkChakraComponents = () => {
    it("should call the Box component correctly", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          ml: 1,
          mr: 1,
          borderWidth: 2,
          borderColor: mockColourHook.componentColour.border,
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          w: currentProps.breakPoints,
          height: currentProps.breakPoints,
        },
        0,
        []
      );
    });

    it("should call the Center component correctly", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, {}, 0, []);
    });
  };

  const checkSunBurstChartContainer = () => {
    it("should call the SunBurstChartContainer component correctly", () => {
      expect(SunBurstChartSVGContainer).toBeCalledTimes(1);
      checkMockCall(
        SunBurstChartSVGContainer,
        {
          colourSet: {
            foreground: mockColourHook.utilities.colourToCSS(
              mockColourHook.sunBurstColour.foreground
            ),
          },
          data: currentProps.data,
          finishTransition: mockFinishTransition,
          leafEntity: mockLeafEntity,
          setSelectedNode: mockNodeSelector,
          selectedNode: currentProps.selectedNode,
          size: settings.sunburstSize,
        },
        0,
        []
      );
    });
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkChakraComponents();
    checkSunBurstChartContainer();
  });
});
