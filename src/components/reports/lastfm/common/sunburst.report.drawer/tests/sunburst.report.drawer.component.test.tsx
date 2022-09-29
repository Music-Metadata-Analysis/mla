import { Divider, Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import SunBurstNodeList from "../nodes/node.list.component";
import SunBurstDrawerControl from "../panels/drawer.control.panel.component";
import SunBurstDrawerTitle from "../panels/drawer.title.panel.component";
import SunBurstReportDrawer, {
  testIDs,
  LastFMSunBurstDrawerInterface,
} from "../sunburst.report.drawer.component";
import Drawer from "@src/components/reports/common/drawer/drawer.component";
import MockSunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/sunburst.report/encapsulations/sunburst.node.encapsulation.base";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/colour");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Divider", "Flex"]);
});

jest.mock("../nodes/node.list.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstNodeList")
);

jest.mock("../panels/drawer.control.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstDrawerControl")
);

jest.mock("../panels/drawer.title.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstDrawerTitle")
);

jest.mock("@src/components/reports/common/drawer/drawer.component", () =>
  require("@fixtures/react/parent").createComponent("Drawer")
);

describe("LastFMSunBurstReportDrawer", () => {
  let mockNode: SunBurstNodeEncapsulation;
  let currentProps: LastFMSunBurstDrawerInterface;
  let mockAlignment: "left" | "right";
  let mockIsOpen: boolean;
  let mockSvgTransition: boolean;
  const mockSelectNode = jest.fn();
  const mockClose = jest.fn();
  const mockLastFMt = jest.fn((key: string) => `lastFMt(${key})`);
  const mockSunBurstT = jest.fn((key: string) => `sunBurstT(${key})`);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockNode = (data: unknown) =>
    (mockNode = new MockSunBurstNodeEncapsulation(data as d3Node));

  const createProps = () => {
    currentProps = {
      alignment: mockAlignment,
      isOpen: mockIsOpen,
      lastFMt: mockLastFMt,
      node: mockNode,
      onClose: mockClose,
      sunBurstT: mockSunBurstT,
      setSelectedNode: mockSelectNode,
      svgTransition: mockSvgTransition,
    };
  };

  const arrange = () => {
    createProps();
    render(<SunBurstReportDrawer {...currentProps} />);
  };

  const getMockArgs = (component: unknown) => {
    return (component as jest.Mock).mock.calls[0][0];
  };

  const checkChakraComponents = () => {
    describe("when the chakra ui components are rendered", () => {
      it("should render Divider with the expected props", () => {
        expect(Divider).toBeCalledTimes(2);

        checkMockCall(
          Divider,
          {
            mt: "10px",
            mb: "10px",
            orientation: "horizontal",
            bg: mockColourHook.componentColour.details,
          },
          0,
          []
        );
        checkMockCall(
          Divider,
          {
            mt: "10px",
            mb: "10px",
            orientation: "horizontal",
            bg: mockColourHook.componentColour.details,
          },
          1,
          []
        );
      });

      it("should render Flex with the expected props", () => {
        expect(Flex).toBeCalledTimes(1);

        checkMockCall(
          Flex,
          {
            flexDirection: "column",
            bg: mockColourHook.componentColour.background,
            color: mockColourHook.componentColour.foreground,
            height: "100%",
          },
          0,
          []
        );
      });
    });
  };

  const checkDrawerComponent = ({
    alignment,
  }: {
    alignment: "left" | "right";
  }) => {
    it("should call the LastFMReportDrawer component with the correct props", () => {
      expect(Drawer).toBeCalledTimes(1);
      checkMockCall(
        Drawer,
        {
          alwaysOpen: true,
          "data-testid": testIDs.LastFMSunBurstDrawer,
          isOpen: currentProps.isOpen,
          onClose: currentProps.onClose,
          placement: alignment,
        },
        0,
        []
      );
    });
  };

  const checkSunBurstDrawerTitlePanel = () => {
    it("should render the SunBurstDrawerTitlePanel component with the correct props", () => {
      expect(SunBurstDrawerTitle).toBeCalledTimes(1);

      checkMockCall(
        SunBurstDrawerTitle,
        {
          node: mockNode,
        },
        0,
        []
      );
    });
  };

  const checkSunBurstDrawerControl = ({
    parent,
  }: {
    parent: d3Node | null;
  }) => {
    it("should render the SunBurstDrawerControlPanel component with the correct props", () => {
      expect(SunBurstDrawerControl).toBeCalledTimes(1);

      checkMockCall(
        SunBurstDrawerControl,
        {
          node: mockNode,
        },
        0,
        ["selectParentNode"]
      );
    });

    describe("when the selectParentNode method is called", () => {
      beforeEach(async () => {
        const fn = getMockArgs(SunBurstDrawerControl).selectParentNode;
        fn();
      });

      it("should call setSelectedNode with the expected argument", () => {
        expect(currentProps.setSelectedNode).toBeCalledTimes(1);
        expect(currentProps.setSelectedNode).toBeCalledWith(parent);
      });
    });
  };

  const checkSunBurstNodeListPanel = ({
    transition,
  }: {
    transition: boolean;
  }) => {
    it("should render the SunBurstNodeListPanel component with the correct props", () => {
      expect(SunBurstNodeList).toBeCalledTimes(1);

      checkMockCall(
        SunBurstNodeList,
        {
          node: mockNode,
          scrollRef: { current: null },
          svgTransition: transition,
        },
        0,
        ["selectChildNode"]
      );
    });

    describe("when the selectChildNode method is called", () => {
      beforeEach(async () => {
        const fn = getMockArgs(SunBurstNodeList).selectChildNode;
        fn(mockNode);
      });

      it("should call setSelectedNode with the expected argument", () => {
        expect(currentProps.setSelectedNode).toBeCalledTimes(1);
        expect(currentProps.setSelectedNode).toBeCalledWith(mockNode.getNode());
      });
    });
  };

  const rootNodeWithNoChildren = {
    data: { name: "Mock Root", entity: "root" },
    value: 100,
  } as d3Node;

  const nodeWithParent = {
    data: {
      name: "Album1",
      entity: "albums",
    },
    children: [
      { data: { name: "Track1", entity: "tracks" } },
      { data: { name: "Track2", entity: "tracks" } },
    ],
    value: 50,
    parent: {
      data: { name: "Artist1", entity: "artists" },
      value: 100,
    },
  } as d3Node;

  describe("when the drawer is Open", () => {
    beforeEach(() => {
      mockIsOpen = true;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        mockSvgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          mockAlignment = "left";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          mockAlignment = "right";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        mockSvgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          mockAlignment = "left";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          mockAlignment = "right";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });
      });
    });
  });

  describe("when the drawer is Closed", () => {
    beforeEach(() => {
      mockIsOpen = false;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        mockSvgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          mockAlignment = "left";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          mockAlignment = "right";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: true });
          });
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        mockSvgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          mockAlignment = "left";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "left" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          mockAlignment = "right";
        });

        describe("when the root node is selected, and there are no children", () => {
          beforeEach(() => {
            createMockNode(rootNodeWithNoChildren);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({ parent: null });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });

        describe("when a node is selected, and there is a parent node", () => {
          beforeEach(() => {
            createMockNode(nodeWithParent);
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkChakraComponents();
            checkDrawerComponent({ alignment: "right" });
            checkSunBurstDrawerTitlePanel();
            checkSunBurstDrawerControl({
              parent: {
                data: { name: "Artist1", entity: "artists" },
                value: 100,
              } as d3Node,
            });
            checkSunBurstNodeListPanel({ transition: false });
          });
        });
      });
    });
  });
});
