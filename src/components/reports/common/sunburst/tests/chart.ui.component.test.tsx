import { Box, Center } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import settings from "../../../../../config/sunburst";
import mockColourHook from "../../../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import SunBurstChartContainer from "../chart.container";
import SunBurstChartUI, { SunBurstChartUIProps } from "../chart.ui.component";
import type { d3Node } from "../../../../../types/reports/sunburst.types";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Center"]);
});

jest.mock("../../../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("../chart.container", () =>
  createMockedComponent("SunBurstChartContainer")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SunBurstChartUI", () => {
  let currentProps: SunBurstChartUIProps;
  const mockNode = { value: 100, data: { name: "mockNode" } } as d3Node;
  const mockSunburstData = {
    value: 100,
    name: "mockRoot ",
    entity: "root" as const,
  };
  const mockLeafEntity = "tracks";
  const mockNodeSelector = jest.fn();
  const mockFinishTransition = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    createProps();
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
    render(<SunBurstChartUI {...currentProps} />);
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
      expect(SunBurstChartContainer).toBeCalledTimes(1);
      checkMockCall(
        SunBurstChartContainer,
        {
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