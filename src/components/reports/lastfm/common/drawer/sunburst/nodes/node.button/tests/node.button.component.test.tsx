import { Flex, Text, Box, Container } from "@chakra-ui/react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import SunBurstNodeButton from "../node.button.component";
import { testIDs } from "../node.button.identifiers";
import MockSunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import RGBA from "@src/utils/colours/rgba.class";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";
import type { SunBurstDrawerNodeComponentProps } from "@src/types/reports/lastfm/components/drawers/sunburst.types";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Flex",
    "Text",
    "Box",
    "Container",
  ])
);

describe("SunBurstEntityButton", () => {
  let mockIndex: number;
  let mockNode: SunBurstNodeAbstractBase;
  const mockSelectNode = jest.fn();
  let currentProps: SunBurstDrawerNodeComponentProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      node: mockNode as SunBurstNodeAbstractBase,
      index: mockIndex,
      selectChildNode: mockSelectNode,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstNodeButton {...currentProps} />);
  };

  describe("when rendered with an index of 0, and a mock node", () => {
    const mockD3Node = {
      data: {
        name: "Actual MockNode that is Encapsulated.",
        entity: "unknown",
      },
      colour: new RGBA("rbga(10,20,30,0.5"),
    } as d3Node;

    beforeEach(() => {
      mockIndex = 0;
      mockNode = new MockSunBurstNodeAbstractBase(mockD3Node);
      arrange();
    });

    it("should call Flex as expected", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(
        Flex,
        {
          w: "100%",
        },
        0,
        []
      );
      checkMockCall(
        Flex,
        {
          h: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        1,
        []
      );
    });

    it("should call Box as expected", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          bg: mockNode.getNodeColour(),
          color: mockColourHook.componentColour.foreground,
          p: 0,
          mt: 1,
          borderWidth: 1,
          borderColor: mockColourHook.componentColour.border,
          w: 12,
        },
        0,
        []
      );
      checkMockCall(
        Box,
        {
          _hover: { bg: mockColourHook.buttonColour.hoverBackground },
          bg: mockColourHook.buttonColour.background,
          color: mockColourHook.buttonColour.foreground,
          p: 0,
          mt: 1,
          borderWidth: 1,
          borderColor: mockColourHook.buttonColour.border,
          justifySelf: "flex-start",
          w: "100%",
          cursor: "pointer",
        },
        1,
        ["onClick"]
      );
    });

    describe("when the Box instance is clicked", () => {
      beforeEach(async () => {
        const text = await screen.findByTestId(testIDs.NodeNameText);
        const button = text.parentElement?.parentElement as HTMLElement;
        fireEvent.click(button);
      });

      it("should call the click handler correctly", () => {
        expect(mockSelectNode).toBeCalledTimes(1);
        expect(mockSelectNode).toBeCalledWith(mockNode);
      });
    });

    it("should call Container as expected", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(Container, {
        m: 0,
        p: 0,
        overflowWrap: "anywhere",
        style: { textIndent: "5px" },
      });
    });

    it("should call Text as expected", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          fontSize: "xs",
          "data-testid": testIDs.NodeValueText,
        },
        0,
        []
      );
      checkMockCall(
        Text,
        {
          fontSize: "sm",
          "data-testid": testIDs.NodeNameText,
        },
        1,
        []
      );
    });

    it("should display the node name", async () => {
      const text = await screen.findByTestId(testIDs.NodeNameText);
      expect(
        await within(text).findAllByText(mockNode.getNodeName())
      ).toBeTruthy();
    });

    it("should display the node percentage", async () => {
      const value = await screen.findByTestId(testIDs.NodeValueText);
      expect(value).toHaveTextContent(
        mockNode.getDrawerEntityListPercentage() + "%"
      );
    });

    it("should display the node index", async () => {
      const text = await screen.findByTestId(testIDs.NodeNameText);
      expect(
        await within(text).findAllByText(`${mockIndex + 1}.`)
      ).toBeTruthy();
    });
  });
});
