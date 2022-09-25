import { Flex, Box, Stat, StatLabel, StatHelpText } from "@chakra-ui/react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import MockSunBurstNodeEncapsulation from "../../encapsulations/tests/fixtures/mock.sunburst.node.encapsulation.class";
import SunBurstControlPanel, {
  testIDs,
  SunBurstControlPanelProps,
} from "../control.panel.component";
import ButtonWithoutAnalytics from "@src/components/button/button.base/button.base.component";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create([
    "Flex",
    "Box",
    "Stat",
    "StatLabel",
    "StatHelpText",
  ]);
});

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@src/components/button/button.base/button.base.component", () =>
  createMockedComponent("ButtonWithoutAnalytics")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

type MockD3Node = Omit<Partial<d3Node>, "parent"> & {
  parent?: Partial<d3Node> | null;
};

describe("SunBurstControlPanel", () => {
  let currentProps: SunBurstControlPanelProps;
  let currentSelectLabel: string;
  let mockIsOpen: boolean;
  const mockBreakPoints = [100, 200, 300];
  const mockNodeParentData: Partial<d3Node> = {
    value: 100,
    data: { name: "mockArtist", entity: "artists", children: [] },
  };
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

  const createMockNode = (data: MockD3Node) => {
    return new MockSunBurstNodeEncapsulation(data as d3Node);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createProps();
  });

  const createProps = () =>
    (currentProps = {
      isOpen: mockIsOpen,
      breakPoints: mockBreakPoints,
      node: createMockNode(mockNodeData),
      openDrawer: jest.fn(),
      setSelectedNode: jest.fn(),
      lastFMt: jest.fn((key: string) => `t(${key})`),
    });

  const arrange = () => {
    render(<SunBurstControlPanel {...currentProps} />);
  };

  const chakraComponentTests = () => {
    describe("when the chakra ui components are rendered", () => {
      const truncateStyle = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      };

      it("should call the Box component correctly", () => {
        expect(Box).toBeCalledTimes(4);
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
        checkMockCall(
          Box,
          {
            ml: 2,
            mr: 2,
            mt: 1,
            mb: 2,
          },
          1,
          []
        );
        checkMockCall(
          Box,
          {
            "data-testid": testIDs.SunBurstControlPanelParentName,
            style: truncateStyle,
          },
          2,
          []
        );
        checkMockCall(
          Box,
          {
            "data-testid": testIDs.SunBurstControlPanelValue,
          },
          3,
          []
        );
      });

      it("should call the Stat component correctly", () => {
        expect(Stat).toBeCalledTimes(1);
        checkMockCall(Stat, {}, 0, []);
      });

      it("should call the StatLabel component correctly", () => {
        expect(StatLabel).toBeCalledTimes(1);
        checkMockCall(
          StatLabel,
          {
            "data-testid": testIDs.SunBurstControlPanelName,
            w: mockBreakPoints.map((breakPoint) => breakPoint - 90),
            style: {
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          },
          0,
          []
        );
      });

      it("should call the StatHelpText component correctly", () => {
        expect(StatHelpText).toBeCalledTimes(1);
        checkMockCall(
          StatHelpText,
          {
            w: mockBreakPoints.map((breakPoint) => breakPoint - 90),
          },
          0,
          []
        );
      });

      it("should call the Flex component correctly", () => {
        expect(Flex).toBeCalledTimes(4);
        checkMockCall(
          Flex,
          {
            justifyContent: "space-between",
            alignItems: "center",
          },
          0,
          []
        );
        checkMockCall(Flex, {}, 1, []);
        checkMockCall(Flex, {}, 2, []);
        checkMockCall(
          Flex,
          {
            flexDirection: "column",
          },
          3,
          []
        );
      });
    });
  };

  const checkNodeProperties = ({ parent }: { parent: boolean }) => {
    it("should render the node's name as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstControlPanelName
      );
      expect(
        await within(container).findByText(currentProps.node.getNodeName())
      ).toBeTruthy();
    });

    if (parent) {
      it("should render the node's parent name as expected", async () => {
        const container = await screen.findByTestId(
          testIDs.SunBurstControlPanelParentName
        );
        expect(
          await within(container).findByText(
            String(currentProps.node.getParentName())
          )
        ).toBeTruthy();
      });
    }

    it("should render the node's value as expected", async () => {
      const container = await screen.findByTestId(
        testIDs.SunBurstControlPanelValue
      );
      expect(
        await within(container).findByText("t(playCountByArtist.panel.value):")
      ).toBeTruthy();
      expect(
        await within(container).findByText(currentProps.node.getValue())
      ).toBeTruthy();
    });
  };

  const checkButtonProperties = ({
    parent,
    drawerOpen,
  }: {
    parent: boolean;
    drawerOpen: boolean;
  }) => {
    it("should render the control buttons as expected", () => {
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
          disabled: !parent || drawerOpen,
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
          disabled: drawerOpen,
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
      expect(await within(button).findByText(currentSelectLabel)).toBeTruthy();
    });

    describe("when the back button is clicked", () => {
      beforeEach(async () => {
        const button = await screen.findByTestId(
          testIDs.SunBurstControlPanelBack
        );
        fireEvent.click(button);
      });

      if (parent && !drawerOpen) {
        it("should select the node's parent", () => {
          expect(currentProps.setSelectedNode).toBeCalledTimes(1);
          expect(currentProps.setSelectedNode).toBeCalledWith(
            currentProps.node.getParent()
          );
        });
      } else {
        it("should not select anything", () => {
          expect(currentProps.setSelectedNode).toBeCalledTimes(0);
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
        currentSelectLabel = "t(playCountByArtist.panel.control)";
        mockNodeData.children = [];
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = null;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: false });
        checkButtonProperties({
          parent: false,
          drawerOpen: true,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = mockNodeParentData;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: true });
        checkButtonProperties({
          parent: true,
          drawerOpen: true,
        });
      });
    });

    describe("when the encapsulated node does has leaf children", () => {
      beforeEach(() => {
        currentSelectLabel = "t(playCountByArtist.panel.leafNodeControl)";

        mockNodeData.children = [
          { data: { name: "mockTrack1", entity: "tracks" } },
          { data: { name: "mockTrack2", entity: "tracks" } },
        ] as Array<d3Node>;
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = null;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: false });
        checkButtonProperties({
          parent: false,
          drawerOpen: true,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = mockNodeParentData;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: true });
        checkButtonProperties({
          parent: true,
          drawerOpen: true,
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
        currentSelectLabel = "t(playCountByArtist.panel.control)";
        mockNodeData.children = [];
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = null;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: false });
        checkButtonProperties({
          parent: false,
          drawerOpen: false,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = mockNodeParentData;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: true });
        checkButtonProperties({
          parent: true,
          drawerOpen: false,
        });
      });
    });

    describe("when the encapsulated node does has leaf children", () => {
      beforeEach(() => {
        currentSelectLabel = "t(playCountByArtist.panel.leafNodeControl)";

        mockNodeData.children = [
          { data: { name: "mockTrack1", entity: "tracks" } },
          { data: { name: "mockTrack2", entity: "tracks" } },
        ] as Array<d3Node>;
      });

      describe("when the encapsulated node does NOT have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = null;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: false });
        checkButtonProperties({
          parent: false,
          drawerOpen: false,
        });
      });

      describe("when the encapsulated node does have a parent entity", () => {
        beforeEach(() => {
          mockNodeData.parent = mockNodeParentData;
          arrange();
        });

        chakraComponentTests();
        checkNodeProperties({ parent: true });
        checkButtonProperties({
          parent: true,
          drawerOpen: false,
        });
      });
    });
  });
});
