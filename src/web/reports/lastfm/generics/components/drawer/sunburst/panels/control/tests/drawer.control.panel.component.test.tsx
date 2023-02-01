import { Flex, Text } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import SunBurstDrawerControlPanel, {
  SunBurstDrawerControlPanelProps,
} from "../drawer.control.panel.component";
import { testIDs } from "../drawer.control.panel.identifiers";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";

jest.mock("@src/components/button/button.base/button.base.component", () =>
  require("@fixtures/react/parent").createComponent("ButtonWithoutAnalytics")
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex", "Text"])
);

describe("SunBurstDrawerControlPanel", () => {
  let currentProps: SunBurstDrawerControlPanelProps;

  const mockSelectParentNode = jest.fn();

  const baseProps = {
    node: new MockSunBurstNodeAbstractBase({} as d3Node),
    percentageText: "mockPercentageText",
    selectParentNode: mockSelectParentNode,
    valueText: "mockValueText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<SunBurstDrawerControlPanel {...currentProps} />);
  };

  const createMockNode = (data: unknown) =>
    (currentProps.node = new MockSunBurstNodeAbstractBase(data as d3Node));

  const resetProps = () => (currentProps = { ...baseProps });

  const checkChakraFlexProps = () => {
    it("should render the chakra Flex component with the expected props", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(
        Flex,
        {
          alignItems: "center",
          justifyContent: "space-between",
        },
        0,
        []
      );
      checkMockCall(
        Flex,
        {
          flexDirection: "column",
        },
        1,
        []
      );
    });
  };

  const checkChakraTextProps = () => {
    it("should render the chakra Text component with the expected props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerValue,
          fontSize: "xs",
        },
        0,
        []
      );
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerPercentage,
          fontSize: "xs",
        },
        1,
        []
      );
    });
  };

  const checkText = () => {
    it("should render the node's value as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerValue
      );
      expect(container.textContent).toBe(
        `${currentProps.valueText}:  ${currentProps.node.getValue()}`
      );
    });

    it("should render the node's percentage as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerPercentage
      );
      expect(container.textContent).toBe(
        `(${currentProps.node.getDrawerPercentage()}${
          currentProps.percentageText
        })`
      );
    });
  };

  const checkButtonProps = ({ parent }: { parent: boolean }) => {
    it("should render the ButtonBase component with the correct props", () => {
      expect(ButtonWithoutAnalytics).toBeCalledTimes(1);
      checkMockCall(
        ButtonWithoutAnalytics,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerBackButton,
          m: 2,
          size: "xs",
          width: 50,
          disabled: !parent,
        },
        0,
        ["onClick"]
      );
    });
  };

  const checkClickBackButton = ({ parent }: { parent: boolean }) => {
    describe("when the back button is clicked", () => {
      beforeEach(async () => {
        const button = await screen.findByTestId(
          testIDs.LastFMSunBurstDrawerBackButton
        );
        fireEvent.click(button);
      });

      if (parent) {
        it("should select the parent node", () => {
          expect(currentProps.selectParentNode).toBeCalledTimes(1);
          expect(currentProps.selectParentNode).toBeCalledWith();
        });
      } else {
        it("should not select anything", () => {
          expect(currentProps.selectParentNode).toBeCalledTimes(0);
        });
      }
    });
  };

  describe("when rendered with a root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockRootNode", entity: "root" },
        value: 100,
      });

      arrange();
    });

    checkChakraFlexProps();
    checkChakraTextProps();
    checkText();
    checkButtonProps({ parent: false });
    checkClickBackButton({ parent: false });
  });

  describe("when rendered with a non-root node", () => {
    beforeEach(() => {
      createMockNode({
        data: { name: "mockNonRootNode", entity: "unknown" },
        value: 100,
        parent: { mock: "node" },
      });

      arrange();
    });

    checkChakraFlexProps();
    checkChakraTextProps();
    checkText();
    checkButtonProps({ parent: true });
    checkClickBackButton({ parent: true });
  });
});
