import { Flex, Text } from "@chakra-ui/react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import SunBurstDrawerControlPanel, {
  testIDs,
  SunBurstDrawerControlPanelProps,
} from "../drawer.control.panel.component";
import lastfm from "@locales/lastfm.json";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/locale");

jest.mock("@src/components/button/button.base/button.base.component", () =>
  require("@fixtures/react/parent").createComponent("ButtonWithoutAnalytics")
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex", "Text"]);
});

describe("SunBurstDrawerControlPanel", () => {
  let currentProps: SunBurstDrawerControlPanelProps;
  let mockNode: SunBurstNodeEncapsulation;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockNode = (data: unknown) =>
    (mockNode = new MockSunBurstNodeEncapsulation(data as d3Node));

  const createProps = () =>
    (currentProps = {
      node: mockNode,
      selectParentNode: jest.fn(),
    });

  const arrange = () => {
    createProps();
    render(<SunBurstDrawerControlPanel {...currentProps} />);
  };

  const checkChakraComponents = () => {
    it("should render Flex with the expected props", () => {
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

    it("should render Text with the expected props", () => {
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
    it("should render the value as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerValue
      );
      expect(
        await within(container).findByText(mockNode.getValue())
      ).toBeTruthy();
      expect(
        await within(container).findByText(
          _t(lastfm.playCountByArtist.drawer.value) + ":"
        )
      ).toBeTruthy();
    });

    it("should render the percentage as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.LastFMSunBurstDrawerPercentage
      );
      expect(container.childNodes[0].textContent).toBe("(");
      expect(container.childNodes[1].textContent).toBe(
        mockNode.getDrawerPercentage()
      );
      expect(container.childNodes[2].textContent).toBe(
        _t(lastfm.playCountByArtist.drawer.percentage)
      );
      expect(container.childNodes[3].textContent).toBe(")");
    });
  };

  const checkButtonComponent = ({ parent }: { parent: boolean }) => {
    it("should render the ButtonBase component with the correct props", () => {
      expect(ButtonWithoutAnalytics).toBeCalledTimes(1);

      checkMockCall(
        ButtonWithoutAnalytics,
        {
          "data-testid": testIDs.LastFMSunBurstDrawerBackButton,
          m: 2,
          size: "xs",
          width: 50,
          disabled: !mockNode.getParent(),
        },
        0,
        ["onClick"]
      );
    });

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

    checkChakraComponents();
    checkText();
    checkButtonComponent({ parent: false });
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

    checkChakraComponents();
    checkText();
    checkButtonComponent({ parent: true });
  });
});
