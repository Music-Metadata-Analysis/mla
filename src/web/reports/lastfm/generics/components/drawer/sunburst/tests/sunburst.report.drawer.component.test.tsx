import { Divider, Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import SunBurstReportDrawer, {
  LastFMSunBurstDrawerProps,
} from "../sunburst.report.drawer.component";
import { testIDs } from "../sunburst.report.drawer.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import ReportDrawer from "@src/web/reports/generics/components/drawer/drawer.component";
import SunBurstNodeListContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.list/node.list.container";
import SunBurstDrawerControlContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/panels/control/drawer.control.panel.container";
import SunBurstDrawerTitleContainer from "@src/web/reports/lastfm/generics/components/drawer/sunburst/panels/title/drawer.title.panel.container";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Divider", "Flex"])
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.list/node.list.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "SunBurstNodeListContainer"
    )
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/drawer/sunburst/panels/control/drawer.control.panel.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "SunBurstDrawerControlContainer"
    )
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/drawer/sunburst/panels/title/drawer.title.panel.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "SunBurstDrawerTitleContainer"
    )
);

jest.mock("@src/web/reports/generics/components/drawer/drawer.component", () =>
  require("@fixtures/react/parent").createComponent("Drawer")
);

describe("LastFMSunBurstReportDrawer", () => {
  let currentProps: LastFMSunBurstDrawerProps;

  const mockNodeListScrollRef = { current: null };

  const mockSelectChildNode = jest.fn();
  const mockSelectParentNode = jest.fn();
  const mockClose = jest.fn();

  const mockReportState = {
    data: { name: "Mock Root", entity: "root" },
    value: 100,
  } as d3Node;

  const baseProps: LastFMSunBurstDrawerProps = {
    alignment: "left" as const,
    isOpen: true,
    nodeListScrollRef: mockNodeListScrollRef,
    node: new MockSunBurstNodeAbstractBase(mockReportState),
    onClose: mockClose,
    selectChildNode: mockSelectChildNode,
    selectParentNode: mockSelectParentNode,
    svgTransition: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = {
      ...baseProps,
    };
  };
  const arrange = () => {
    render(<SunBurstReportDrawer {...currentProps} />);
  };

  const checkReportDrawerComponent = () => {
    it("should call the common ReportDrawer component with the correct props", () => {
      expect(ReportDrawer).toBeCalledTimes(1);
      checkMockCall(
        ReportDrawer,
        {
          alwaysOpen: true,
          "data-testid": testIDs.LastFMSunBurstDrawer,
          isOpen: currentProps.isOpen,
          onClose: currentProps.onClose,
          placement: currentProps.alignment,
        },
        0,
        []
      );
    });
  };

  const checkChakraFlexComponent = () => {
    it("should render the chakra Flex component with the expected props", () => {
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
  };

  const checkSunBurstDrawerTitle = () => {
    it("should render the SunBurstDrawerTitle component with the correct props", () => {
      expect(SunBurstDrawerTitleContainer).toBeCalledTimes(1);
      checkMockCall(
        SunBurstDrawerTitleContainer,
        {
          node: currentProps.node,
        },
        0,
        []
      );
    });
  };

  const checkChakraDividerComponent = () => {
    it("should render chakra Divider component with the expected props", () => {
      expect(Divider).toBeCalledTimes(2);
      const dividerProps = {
        mt: "10px",
        mb: "10px",
        orientation: "horizontal",
        borderColor: mockColourHook.componentColour.foreground,
      };
      checkMockCall(Divider, dividerProps, 0, []);
      checkMockCall(Divider, dividerProps, 1, []);
    });
  };

  const checkSunBurstDrawerControl = () => {
    it("should render the SunBurstDrawerControl component with the correct props", () => {
      expect(SunBurstDrawerControlContainer).toBeCalledTimes(1);

      checkMockCall(
        SunBurstDrawerControlContainer,
        {
          node: currentProps.node,
          selectParentNode: currentProps.selectParentNode,
        },
        0
      );
    });
  };

  const checkSunBurstNodeList = () => {
    it("should render the SunBurstNodeList component with the correct props", () => {
      expect(SunBurstNodeListContainer).toBeCalledTimes(1);
      checkMockCall(
        SunBurstNodeListContainer,
        {
          node: currentProps.node,
          scrollRef: currentProps.nodeListScrollRef,
          selectChildNode: currentProps.selectChildNode,
          svgTransition: currentProps.svgTransition,
        },
        0
      );
    });
  };

  describe("when the drawer is Open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });
    });
  });

  describe("when the drawer is Closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;
    });

    describe("when there is a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = true;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });

      describe("when the alignment is RIGHT", () => {
        beforeEach(() => {
          currentProps.alignment = "right";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });
      });
    });

    describe("when there is NOT a SVG transition", () => {
      beforeEach(() => {
        currentProps.svgTransition = false;
      });

      describe("when the alignment is LEFT", () => {
        beforeEach(() => {
          currentProps.alignment = "left";
        });

        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkReportDrawerComponent();
          checkChakraFlexComponent();
          checkSunBurstDrawerTitle();
          checkChakraDividerComponent();
          checkSunBurstDrawerControl();
          checkSunBurstNodeList();
        });

        describe("when the alignment is RIGHT", () => {
          beforeEach(() => {
            currentProps.alignment = "right";
          });

          describe("when rendered", () => {
            beforeEach(() => arrange());

            checkReportDrawerComponent();
            checkChakraFlexComponent();
            checkSunBurstDrawerTitle();
            checkChakraDividerComponent();
            checkSunBurstDrawerControl();
            checkSunBurstNodeList();
          });
        });
      });
    });
  });
});
