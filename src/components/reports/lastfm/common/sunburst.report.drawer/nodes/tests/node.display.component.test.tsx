import { Text, Box, Container } from "@chakra-ui/react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import SunBurstNodeDisplay, { testIDs } from "../node.display.component";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/tests/fixtures/mock.sunburst.node.encapsulation.class";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { SunBurstDrawerNodeComponentProps } from "@src/types/clients/api/lastfm/sunburst.types";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Text", "Box", "Container"]);
});

describe("SunBurstNodeDisplay", () => {
  let mockIndex: number;
  let mockNode: SunBurstNodeEncapsulation;
  const mockSelectNode = jest.fn();
  let currentProps: SunBurstDrawerNodeComponentProps;
  const mockD3Node = {
    data: {
      name: "Actual MockNode that is Encapsulated.",
      entity: "unknown",
    },
  } as d3Node;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createProps = () =>
    (currentProps = {
      node: mockNode as SunBurstNodeEncapsulation,
      index: mockIndex,
      selectChildNode: mockSelectNode,
    });

  const arrange = () => {
    createProps();
    render(<SunBurstNodeDisplay {...currentProps} />);
  };

  describe("when rendered with an index of 0, and a mock node", () => {
    beforeEach(() => {
      mockIndex = 0;
      mockNode = new MockSunBurstNodeEncapsulation(mockD3Node);
      arrange();
    });

    it("should call Box as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          p: 0,
          mt: 1,
          borderWidth: 1,
          borderColor: mockColourHook.componentColour.border,
        },
        0
      );
    });

    describe("when the Box instance is clicked", () => {
      beforeEach(async () => {
        const text = await screen.findByTestId(testIDs.NodeDisplayText);
        const button = text.parentElement?.parentElement as HTMLElement;
        fireEvent.click(button);
      });

      it("should NOT call a click handler", () => {
        expect(mockSelectNode).toBeCalledTimes(0);
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
      expect(Text).toBeCalledTimes(1);
      checkMockCall(Text, {
        fontSize: "sm",
        "data-testid": testIDs.NodeDisplayText,
      });
    });

    it("should display the node name", async () => {
      const text = await screen.findByTestId(testIDs.NodeDisplayText);
      expect(
        await within(text).findAllByText(mockNode.getNodeName())
      ).toBeTruthy();
    });

    it("should display the node name", async () => {
      const text = await screen.findByTestId(testIDs.NodeDisplayText);
      expect(
        await within(text).findAllByText(`${mockIndex + 1}.`)
      ).toBeTruthy();
    });
  });
});
