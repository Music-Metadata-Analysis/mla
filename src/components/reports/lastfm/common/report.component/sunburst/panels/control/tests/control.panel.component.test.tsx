import { Flex, Box } from "@chakra-ui/react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import SunBurstControlPanel, {
  SunBurstControlPanelProps,
} from "../control.panel.component";
import { testIDs } from "../control.panel.identifiers";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import MockSunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import SunBurstDetailsPanel from "@src/components/reports/lastfm/common/report.component/sunburst/panels/details/details.panel.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import type { d3Node } from "@src/types/reports/generics/sunburst.types";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex", "Box", "Stat", "StatLabel", "StatHelpText"]);
});

jest.mock(
  "@src/components/reports/lastfm/common/report.component/sunburst/panels/details/details.panel.component",
  () =>
    require("@fixtures/react/parent").createComponent("SunBurstDetailsPanel")
);

jest.mock("@src/components/button/button.base/button.base.component", () =>
  require("@fixtures/react/parent").createComponent("ButtonWithoutAnalytics")
);

type MockD3Node = Omit<Partial<d3Node>, "parent"> & {
  parent?: Partial<d3Node> | null;
};

describe("SunBurstControlPanel", () => {
  let currentProps: SunBurstControlPanelProps;

  const mockBreakPoints = [100, 200, 300];
  const mockNodeParentData = {
    value: 100,
    data: { name: "mockArtist", entity: "artists", children: [] },
  } as unknown as d3Node;
  const mockNodeData: MockD3Node = {
    value: 50,
    data: {
      name: "mockAlbum",
      entity: "albums",
      children: [],
    },
    children: [],
    parent: mockNodeParentData,
  };

  const mockOpenDrawer = jest.fn();
  const mockSetSelectedNode = jest.fn();
  const mockT = new MockUseTranslation("lastfm").t;

  const baseProps = {
    isOpen: true,
    breakPoints: mockBreakPoints,
    node: new MockSunBurstNodeAbstractBase({ ...mockNodeData } as d3Node),
    openDrawer: mockOpenDrawer,
    setSelectedNode: mockSetSelectedNode,
    lastFMt: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<SunBurstControlPanel {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkChakraBoxProps = () => {
    it("should render the chakra Box component as expected", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          borderWidth: 2,
          borderColor: mockColourHook.componentColour.border,
          bg: mockColourHook.componentColour.background,
          color: mockColourHook.componentColour.foreground,
          w: mockBreakPoints,
        },
        0,
        []
      );
    });
  };

  const checkChakraFlexProps = () => {
    it("should render the chakra Flex component as expected", () => {
      expect(Flex).toBeCalledTimes(2);
      checkMockCall(
        Flex,
        {
          justifyContent: "space-between",
          alignItems: "center",
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

  const checkSunBurstDetailsPanelProps = () => {
    it("should render the SunBurstDetailsPanel component as expected", async () => {
      expect(SunBurstDetailsPanel).toBeCalledTimes(1);
      checkMockCall(
        SunBurstDetailsPanel,
        {
          breakPoints: currentProps.breakPoints,
          lastFMt: currentProps.lastFMt,
          nodeName: currentProps.node.getNodeName(),
          nodeParentName: currentProps.node.getParentName(),
          nodeValue: currentProps.node.getValue(),
        },
        0
      );
    });
  };

  const checkButtonProps = ({
    expectedSelectLabel,
    hasParent,
    isOpen,
  }: {
    expectedSelectLabel: string;
    hasParent: boolean;
    isOpen: boolean;
  }) => {
    it("should render the ButtonWithoutAnalytics component with the expected props", () => {
      expect(ButtonWithoutAnalytics).toBeCalledTimes(2);
      checkMockCall(
        ButtonWithoutAnalytics,
        {
          "data-testid": testIDs.SunBurstControlPanelBack,
          ml: 2,
          mr: 2,
          mt: 2,
          mb: 2,
          size: "xs",
          width: 50,
          disabled: !hasParent || isOpen,
        },
        0,
        ["onClick"]
      );
      checkMockCall(
        ButtonWithoutAnalytics,
        {
          "data-testid": testIDs.SunBurstControlPanelSelect,
          ml: 2,
          mr: 2,
          mt: 2,
          mb: 2,
          size: "xs",
          width: 50,
          disabled: isOpen,
          onClick: currentProps.openDrawer,
        },
        1,
        []
      );
    });

    it("should render the expected back button label", async () => {
      const button = await screen.findByTestId(
        testIDs.SunBurstControlPanelBack
      );
      expect(await within(button).findByText("\u25B2")).toBeTruthy();
    });

    it("should render the expected select button label", async () => {
      const button = await screen.findByTestId(
        testIDs.SunBurstControlPanelSelect
      );
      expect(
        await within(button).findByText(mockT(expectedSelectLabel))
      ).toBeTruthy();
    });

    describe("when the back button is clicked", () => {
      beforeEach(async () => {
        const button = await screen.findByTestId(
          testIDs.SunBurstControlPanelBack
        );
        fireEvent.click(button);
      });

      if (hasParent && !isOpen) {
        it("should select the node's parent", () => {
          expect(mockSetSelectedNode).toBeCalledTimes(1);
          expect(mockSetSelectedNode).toBeCalledWith(
            currentProps.node.getParent()
          );
        });
      } else {
        it("should not select anything", () => {
          expect(mockSetSelectedNode).toBeCalledTimes(0);
        });
      }
    });
  };

  describe("when the drawer is open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;
    });

    describe("when the encapsulated node does NOT have leaf children", () => {
      beforeEach(() => {
        currentProps.node.getNode().children = [];
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = null;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.control",
          hasParent: false,
          isOpen: true,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = mockNodeParentData;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.control",
          hasParent: true,
          isOpen: true,
        });
      });
    });

    describe("when the encapsulated node has leaf children", () => {
      beforeEach(() => {
        currentProps.node.getNode().children = [
          { data: { name: "mockTrack1", entity: "tracks" } },
          { data: { name: "mockTrack2", entity: "tracks" } },
        ] as Array<d3Node>;
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = null;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.leafNodeControl",
          hasParent: false,
          isOpen: true,
        });
      });

      describe("when the encapsulated node has a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = mockNodeParentData;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.leafNodeControl",
          hasParent: true,
          isOpen: true,
        });
      });
    });
  });

  describe("when the drawer is closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;
    });

    describe("when the encapsulated node does NOT have leaf children", () => {
      beforeEach(() => {
        currentProps.node.getNode().children = [];
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = null;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.control",
          hasParent: false,
          isOpen: false,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = mockNodeParentData;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.control",
          hasParent: true,
          isOpen: false,
        });
      });
    });

    describe("when the encapsulated node does has leaf children", () => {
      beforeEach(() => {
        currentProps.node.getNode().children = [
          { data: { name: "mockTrack1", entity: "tracks" } },
          { data: { name: "mockTrack2", entity: "tracks" } },
        ] as Array<d3Node>;
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = null;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.leafNodeControl",
          hasParent: false,
          isOpen: false,
        });
      });

      describe("when the encapsulated node has a parent entity", () => {
        beforeEach(() => {
          currentProps.node.getNode().parent = mockNodeParentData;

          arrange();
        });

        checkChakraBoxProps();
        checkChakraFlexProps();
        checkSunBurstDetailsPanelProps();
        checkButtonProps({
          expectedSelectLabel: "playCountByArtist.panel.leafNodeControl",
          hasParent: true,
          isOpen: false,
        });
      });
    });
  });
});
