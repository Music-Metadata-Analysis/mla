import { Box, Flex } from "@chakra-ui/react";
import { act, render, fireEvent } from "@testing-library/react";
import { MockReportClass } from "./implementations/concrete.sunburst.report.class";
import * as layout from "../layout/sunburst.report.layout";
import SunBurstControlPanel from "../panels/control.panel.component";
import SunBurstInfoPanel from "../panels/info.panel.component";
import SunBurstNotVisiblePanel from "../panels/not.visible.panel.component";
import SunBurstTitlePanel from "../panels/title.panel.component";
import SunBurstReport, {
  SunBurstReportProps,
  SunBurstReportLayouts,
} from "../sunburst.report.component";
import SunBurstChartUI from "@src/components/reports/common/sunburst/chart.ui.component";
import mockLayoutHookValues from "@src/components/reports/lastfm/common/sunburst.report/layout/__mocks__/sunburst.report.layout.hook.mock";
import settings from "@src/config/sunburst";
import Events from "@src/events/events";
import mockUseAnalytics from "@src/hooks/__mocks__/analytics.mock";
import mockNavBarHook from "@src/hooks/__mocks__/navbar.mock";
import mockSunBurstState from "@src/hooks/__mocks__/sunburst.mock";
import nullNode from "@src/providers/user/reports/sunburst.node.initial";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import { getMockComponentProp } from "@src/tests/fixtures/mock.component.props";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { d3Node } from "@src/types/reports/sunburst.types";

jest.mock("@src/hooks/analytics");

jest.mock("@src/hooks/navbar");

jest.mock("@src/hooks/sunburst");

jest.mock(
  "@src/components/reports/lastfm/common/sunburst.report/layout/sunburst.report.layout.hook"
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  const mock = {
    ...createChakraMock(["Box", "Flex"]),
    useDisclosure: () => mockDisclosure,
  };
  return mock;
});

jest.mock("@src/events/events", () => ({
  LastFM: {
    SunBurstNodeSelected: jest.fn(() => "CorrectAnalyticsEvent!"),
  },
}));

jest.mock("../layout/sunburst.report.layout", () => ({
  canFitOnScreen: jest.fn(),
  getLayoutType: jest.fn(),
}));

jest.mock("@src/components/reports/common/sunburst/chart.ui.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstChartUI")
);

jest.mock("../panels/control.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstControlPanel")
);

jest.mock("../panels/info.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstInfoPanel")
);

jest.mock("../panels/not.visible.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstNotVisiblePanel")
);

jest.mock("../panels/title.panel.component", () =>
  require("@fixtures/react/parent").createComponent("SunBurstTitlePanel")
);

const mockDisclosure = {
  isOpen: true,
  onOpen: jest.fn(),
  onClose: jest.fn(),
};

describe("SunBurstReport", () => {
  let currentProps: SunBurstReportProps<UserState<unknown>>;
  const mockNode = { data: { name: "mockNode", entity: "unknown" as const } };
  const mockReport = new MockReportClass();
  const mockLastFMt = jest.fn((key: string) => `lastFMt(${key})`);
  const mockSunBurstT = jest.fn((key: string) => `sunBurstT(${key})`);
  const mockUserState = {
    userProperties: {
      data: {
        report: {
          playcount: 100,
          playCountByArtist: { status: {}, created: "Today", content: [] },
        },
      },
      userName: "niall-byrne",
    },
  } as unknown as UserState<unknown>;

  const expectedBreakPoints = [250, 250, 300, 500, 600, 600];
  let isVisible: boolean;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSunBurstState.getters.selectedNode ===
      (JSON.parse(JSON.stringify(nullNode)) as d3Node);
    mockSunBurstState.getters.selectedNode.data = mockNode.data;
    createProps();
  });

  const createProps = () =>
    (currentProps = {
      report: mockReport,
      lastFMt: mockLastFMt,
      sunBurstT: mockSunBurstT,
      userState: mockUserState,
      visible: isVisible,
    });

  const arrange = () => {
    render(<SunBurstReport {...currentProps} />);
  };

  const checkTopLevelChakraFlex = ({
    display,
  }: {
    display: "inline" | "none";
  }) => {
    it("should call the top level Flex component correctly", () => {
      expect(jest.mocked(Flex).mock.calls.length).toBeGreaterThan(0);
      checkMockCall(
        Flex,
        {
          display,
          mt: 75,
          pl: 50,
          pr: 50,
          height: `calc(100vh - ${settings.navbarOffset}px)`,
          flexDirection: "column",
        },
        0,
        []
      );
    });
  };

  const checkLayoutControlChakraFlex = ({
    layoutType,
    visible,
  }: {
    layoutType: keyof typeof SunBurstReportLayouts;
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the layout control Flex component correctly", () => {
        expect(jest.mocked(Flex).mock.calls.length).toBeGreaterThan(1);
        checkMockCall(
          Flex,
          {
            mt: 50,
            justifyContent: "center",
            flexWrap: "wrap",
            ...SunBurstReportLayouts[layoutType],
          },
          1,
          []
        );
      });
    } else {
      it("should NOT the layout control Flex component", () => {
        expect(Flex).toBeCalledTimes(1);
      });
    }
  };

  const checkOtherChakraComponents = ({
    display,
    visible,
  }: {
    display: "inline" | "none";
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the info section Flex component correctly", () => {
        expect(Flex).toBeCalledTimes(3);
        checkMockCall(
          Flex,
          {
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
          },
          2,
          []
        );
      });

      it("should call the Box component correctly", () => {
        expect(Box).toBeCalledTimes(1);
        checkMockCall(
          Box,
          {
            display,
          },
          0,
          []
        );
      });
    } else {
      it("should NOT call the sectionOne Flex component", () => {
        expect(Flex).toBeCalledTimes(1);
      });

      it("should NOT call the Box component", () => {
        expect(Box).toBeCalledTimes(0);
      });
    }
  };

  const checkDrawerComponent = ({
    drawerIsOpen,
    transition,
    visible,
  }: {
    drawerIsOpen: boolean;
    transition: boolean;
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the Drawer component correctly", () => {
        const DrawerComponent = currentProps.report.getDrawerComponent();
        expect(DrawerComponent).toBeCalledTimes(1);
        checkMockCall(
          DrawerComponent,
          {
            alignment: "left",
            isOpen: drawerIsOpen,
            node: mockReport.getEncapsulatedNode(nullNode as d3Node),
            lastFMt: mockLastFMt,
            sunBurstT: mockSunBurstT,
            svgTransition: transition,
          },
          0,
          ["onClose", "setSelectedNode"],
          false,
          [{ name: "node", class: currentProps.report.nodeEncapsulationClass }]
        );
      });

      describe("when the Drawer's 'onClose' function is called", () => {
        beforeEach(() => {
          const DrawerComponent = currentProps.report.getDrawerComponent();
          const fn = getMockComponentProp({
            component: DrawerComponent,
            propName: "onClose",
            call: 0,
          });
          act(() => fn());
        });

        it("should enable the NavBar's Hamburger Button, and close the drawer", () => {
          expect(mockNavBarHook.setters.enableHamburger).toBeCalledTimes(1);
          expect(mockDisclosure.onClose).toBeCalledTimes(1);
        });
      });
    } else {
      it("should NOT call the Drawer component", () => {
        const DrawerComponent = currentProps.report.getDrawerComponent();
        expect(DrawerComponent).toBeCalledTimes(0);
      });
    }
  };

  const checkSunBurstTitlePanelComponent = ({
    visible,
  }: {
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the SunBurstTitlePanel component correctly", () => {
        expect(SunBurstTitlePanel).toBeCalledTimes(1);
        checkMockCall(
          SunBurstTitlePanel,
          {
            breakPoints: expectedBreakPoints,
            userName: mockUserState.userProperties.userName,
            title: mockLastFMt(mockReport.getReportTranslationKey() + ".title"),
          },
          0,
          []
        );
      });
    } else {
      it("should NOT call the SunBurstTitlePanel component", () => {
        expect(SunBurstTitlePanel).toBeCalledTimes(0);
      });
    }
  };

  const checkSunBurstControlPanelComponent = ({
    drawerIsOpen,
    visible,
  }: {
    drawerIsOpen: boolean;
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the SunBurstControlPanel component correctly", () => {
        expect(SunBurstControlPanel).toBeCalledTimes(1);
        checkMockCall(
          SunBurstControlPanel,
          {
            breakPoints: expectedBreakPoints,
            isOpen: drawerIsOpen,
            lastFMt: mockLastFMt,
            node: mockReport.getEncapsulatedNode(nullNode as d3Node),
          },
          0,
          ["openDrawer", "setSelectedNode"],
          false,
          [{ name: "node", class: currentProps.report.nodeEncapsulationClass }]
        );
      });

      describe("when the SunBurstControlPanel 'openDrawer' function is called", () => {
        beforeEach(() => {
          const fn = getMockComponentProp({
            component: SunBurstControlPanel,
            propName: "openDrawer",
            call: 0,
          });
          act(() => fn());
        });

        it("should disabled the NavBar's Hamburger Button, and open the drawer", () => {
          expect(mockNavBarHook.setters.disableHamburger).toBeCalledTimes(1);
          expect(mockDisclosure.onOpen).toBeCalledTimes(1);
        });
      });
    } else {
      it("should NOT call the SunBurstControlPanel component", () => {
        expect(SunBurstControlPanel).toBeCalledTimes(0);
      });
    }
  };

  const checkSunBurstInfoPanelComponent = ({
    visible,
  }: {
    visible: boolean;
  }) => {
    if (visible) {
      it("should call the SunBurstInfoPanel component correctly", () => {
        expect(SunBurstInfoPanel).toBeCalledTimes(1);
        checkMockCall(
          SunBurstInfoPanel,
          {
            breakPoints: expectedBreakPoints,
            message: mockSunBurstT("info.interaction"),
          },
          0,
          []
        );
      });
    } else {
      it("should NOT call the SunBurstInfoPanel component", () => {
        expect(SunBurstInfoPanel).toBeCalledTimes(0);
      });
    }
  };

  const checkSunBurstChartUIComponent = ({ visible }: { visible: boolean }) => {
    if (visible) {
      it("should call the SunBurstChartUI component correctly", () => {
        expect(SunBurstChartUI).toBeCalledTimes(1);
        checkMockCall(
          SunBurstChartUI,
          {
            breakPoints: expectedBreakPoints,
            data: mockReport.getSunBurstData(
              mockUserState.userProperties,
              mockLastFMt(
                `${String(mockReport.getReportTranslationKey())}.rootTag`
              ),
              mockLastFMt(
                `${String(mockReport.getReportTranslationKey())}.remainderTag`
              )
            ),
            leafEntity: mockReport.getEntityLeaf(),
            selectedNode: nullNode,
          },
          0,
          ["finishTransition", "setSelectedNode"]
        );
      });
    } else {
      it("should NOT call the SunBurstChartUI component", () => {
        expect(SunBurstChartUI).toBeCalledTimes(0);
      });
    }
  };

  const checkSunBurstNotVisiblePanelComponent = ({
    fitsOnScreen,
    visible,
  }: {
    fitsOnScreen: boolean;
    visible: boolean;
  }) => {
    if (fitsOnScreen) {
      if (!visible) {
        it("should NOT call the SunBurstNotVisiblePanel component correctly", () => {
          expect(SunBurstNotVisiblePanel).toBeCalledTimes(0);
        });
      }
    } else {
      if (visible) {
        it("should call the SunBurstNotVisiblePanel component correctly", () => {
          expect(SunBurstNotVisiblePanel).toBeCalledTimes(1);
          checkMockCall(
            SunBurstNotVisiblePanel,
            {
              breakPoints: expectedBreakPoints,
              message: mockSunBurstT("errors.screenSize"),
            },
            0,
            []
          );
        });
      }
    }
  };

  const checkFunctions = ({
    visible,
    layoutType,
  }: {
    visible: boolean;
    layoutType: keyof typeof SunBurstReportLayouts;
  }) => {
    if (visible) {
      describe("finishSvgTransition", () => {
        let fn: (...args: unknown[]) => void;

        beforeEach(() => {
          fn = getMockComponentProp({
            component: SunBurstChartUI,
            propName: "finishTransition",
          });
          act(() => fn());
        });

        it("should call the correct setter with the correct value", async () => {
          expect(mockSunBurstState.setters.setSvgTransition).toBeCalledTimes(1);
          expect(mockSunBurstState.setters.setSvgTransition).toBeCalledWith(
            false
          );
        });
      });

      describe("selectNode", () => {
        let fn: (...args: unknown[]) => void;
        const selectedNode = {
          data: { name: "selectedNode", entity: "unknown" as const },
        };

        const callFn = async () => act(async () => fn(selectedNode));

        describe("on the Drawer component", () => {
          beforeEach(() => {
            const DrawerComponent = currentProps.report.getDrawerComponent();
            fn = getMockComponentProp({
              component: DrawerComponent,
              propName: "setSelectedNode",
            });
          });

          describe("when a node is selected", () => {
            beforeEach(async () => await callFn());

            checkAnalytics();

            it("should call the correct setter with the correct value", async () => {
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledTimes(
                1
              );
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledWith(
                selectedNode
              );
            });
          });
        });

        describe("on the SunBurstControlPanel component", () => {
          beforeEach(() => {
            fn = getMockComponentProp({
              component: SunBurstControlPanel,
              propName: "setSelectedNode",
            });
          });

          describe("when a node is selected", () => {
            beforeEach(async () => await callFn());

            checkAnalytics();

            it("should call the correct setter with the correct value", async () => {
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledTimes(
                1
              );
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledWith(
                selectedNode
              );
            });
          });
        });

        describe("on the SunBurstChartUI component", () => {
          beforeEach(() => {
            fn = getMockComponentProp({
              component: SunBurstChartUI,
              propName: "setSelectedNode",
            });
          });

          describe("when a node is selected", () => {
            beforeEach(async () => await callFn());

            checkAnalytics();

            it("should call the correct setter with the correct value", async () => {
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledTimes(
                1
              );
              expect(mockSunBurstState.setters.setSelectedNode).toBeCalledWith(
                selectedNode
              );
            });
          });
        });
      });

      describe("updateLayout", () => {
        beforeEach(() => {
          mockLayoutHookValues.setters.setFitsOnScreen.mockClear();
          mockLayoutHookValues.setters.setCurrentLayout.mockClear();
          jest.mocked(layout.getLayoutType).mockClear();
        });

        const checkFitsOnScreen = () => {
          it("should be called to update the layout", () => {
            expect(
              mockLayoutHookValues.setters.setFitsOnScreen
            ).toBeCalledTimes(1);
            expect(mockLayoutHookValues.setters.setFitsOnScreen).toBeCalledWith(
              layout.canFitOnScreen()
            );
          });
        };

        describe("setFitsOnScreen", () => {
          describe("when a resize event occurs", () => {
            beforeEach(() => fireEvent.resize(window));

            checkFitsOnScreen();
          });
        });

        describe("setCurrentLayout", () => {
          const checkSetCurrentLayout = () => {
            it("should be called to update the layout", () => {
              expect(
                mockLayoutHookValues.setters.setCurrentLayout
              ).toBeCalledTimes(1);
              expect(
                mockLayoutHookValues.setters.setCurrentLayout
              ).toBeCalledWith(layoutType);
              expect(layout.getLayoutType).toBeCalledTimes(1);
              expect(layout.getLayoutType).toBeCalledWith(
                mockLayoutHookValues.sections.info,
                mockLayoutHookValues.sections.chart
              );
            });
          };

          describe("when a resize event occurs", () => {
            beforeEach(() => fireEvent.resize(window));

            checkSetCurrentLayout();
          });
        });
      });
    }
  };

  const checkAnalytics = () => {
    it("should trigger an analytics event", () => {
      expect(mockUseAnalytics.event).toBeCalledTimes(1);
      expect(Events.LastFM.SunBurstNodeSelected).toBeCalledTimes(1);
    });

    it("the correct event should be sent", () => {
      expect(mockUseAnalytics.event).toBeCalledWith("CorrectAnalyticsEvent!");
      expect(Events.LastFM.SunBurstNodeSelected).toBeCalledWith(
        mockNode.data.entity.toUpperCase(),
        mockNode.data.name
      );
    });
  };

  describe("fits on screen", () => {
    beforeEach(() => {
      jest.mocked(layout.canFitOnScreen).mockReturnValue(true);
      mockLayoutHookValues.getters.fitsOnScreen = true;
    });

    describe("normal layout", () => {
      beforeEach(() => {
        (layout.getLayoutType as jest.Mock).mockReturnValue("normal");
        mockLayoutHookValues.getters.currentLayout = "normal";
      });

      describe("when visible is true", () => {
        beforeEach(() => (currentProps.visible = true));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: true,
          });
          checkOtherChakraComponents({ display: "inline", visible: true });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: true,
          });
          checkFunctions({ layoutType: "normal", visible: true });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: true,
          });
          checkOtherChakraComponents({ display: "inline", visible: true });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: true,
          });
          checkFunctions({ layoutType: "normal", visible: true });
        });
      });

      describe("when visible is false", () => {
        beforeEach(() => (currentProps.visible = false));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: false,
          });
          checkOtherChakraComponents({ display: "inline", visible: false });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: false,
          });
          checkFunctions({ layoutType: "normal", visible: false });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: false,
          });
          checkOtherChakraComponents({ display: "inline", visible: false });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: false,
          });
          checkFunctions({ layoutType: "normal", visible: false });
        });
      });
    });

    describe("wide layout", () => {
      beforeEach(() => {
        (layout.getLayoutType as jest.Mock).mockReturnValue("wide");
        mockLayoutHookValues.getters.currentLayout = "wide";
      });

      describe("when visible is true", () => {
        beforeEach(() => (currentProps.visible = true));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: true,
          });
          checkOtherChakraComponents({ display: "inline", visible: true });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: true,
          });
          checkFunctions({ layoutType: "wide", visible: true });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: true,
          });
          checkOtherChakraComponents({ display: "inline", visible: true });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: true,
          });
          checkFunctions({ layoutType: "wide", visible: true });
        });
      });

      describe("when visible is false", () => {
        beforeEach(() => (currentProps.visible = false));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: false,
          });
          checkOtherChakraComponents({ display: "inline", visible: false });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: false,
          });
          checkFunctions({ visible: false, layoutType: "wide" });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: false,
          });
          checkOtherChakraComponents({ display: "inline", visible: false });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: true,
            visible: false,
          });
          checkFunctions({ visible: false, layoutType: "wide" });
        });
      });
    });
  });

  describe("does not fit on screen", () => {
    beforeEach(() => {
      (layout.canFitOnScreen as jest.Mock).mockReturnValue(false);
      mockLayoutHookValues.getters.fitsOnScreen = false;
    });

    describe("normal layout", () => {
      beforeEach(() => {
        jest.mocked(layout.getLayoutType).mockReturnValue("normal");
        mockLayoutHookValues.getters.currentLayout = "normal";
      });

      describe("when visible is true", () => {
        beforeEach(() => (currentProps.visible = true));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: true,
          });
          checkOtherChakraComponents({ display: "none", visible: true });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: true,
          });
          checkFunctions({ layoutType: "normal", visible: true });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: true,
          });
          checkOtherChakraComponents({ display: "none", visible: true });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: true,
          });
          checkFunctions({ layoutType: "normal", visible: true });
        });
      });

      describe("when visible is false", () => {
        beforeEach(() => (currentProps.visible = false));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: false,
          });
          checkOtherChakraComponents({ display: "none", visible: false });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: false,
          });
          checkFunctions({ visible: false, layoutType: "normal" });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "normal",
            visible: false,
          });
          checkOtherChakraComponents({ display: "none", visible: false });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: false,
          });
          checkFunctions({ visible: false, layoutType: "normal" });
        });
      });
    });

    describe("wide layout", () => {
      beforeEach(() => {
        (layout.getLayoutType as jest.Mock).mockReturnValue("wide");
        mockLayoutHookValues.getters.currentLayout = "wide";
      });

      describe("when visible is true", () => {
        beforeEach(() => (currentProps.visible = true));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: true,
          });
          checkOtherChakraComponents({ display: "none", visible: true });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: true,
          });
          checkFunctions({ layoutType: "wide", visible: true });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "inline" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: true,
          });
          checkOtherChakraComponents({ display: "none", visible: true });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: true,
          });
          checkSunBurstTitlePanelComponent({
            visible: true,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: true,
          });
          checkSunBurstInfoPanelComponent({ visible: true });
          checkSunBurstChartUIComponent({ visible: true });
          checkSunBurstNotVisiblePanelComponent({
            fitsOnScreen: false,
            visible: true,
          });
          checkFunctions({ layoutType: "wide", visible: true });
        });
      });

      describe("when visible is false", () => {
        beforeEach(() => (currentProps.visible = false));

        describe("when the drawer is closed", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = false;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: false,
          });
          checkOtherChakraComponents({ display: "none", visible: false });
          checkDrawerComponent({
            drawerIsOpen: false,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: false,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            visible: false,
            fitsOnScreen: false,
          });
          checkFunctions({ layoutType: "wide", visible: false });
        });

        describe("when the drawer is open", () => {
          beforeEach(() => {
            mockDisclosure.isOpen = true;
            arrange();
          });

          checkAnalytics();
          checkTopLevelChakraFlex({ display: "none" });
          checkLayoutControlChakraFlex({
            layoutType: "wide",
            visible: false,
          });
          checkOtherChakraComponents({ display: "none", visible: false });
          checkDrawerComponent({
            drawerIsOpen: true,
            transition: false,
            visible: false,
          });
          checkSunBurstTitlePanelComponent({
            visible: false,
          });
          checkSunBurstControlPanelComponent({
            drawerIsOpen: true,
            visible: false,
          });
          checkSunBurstInfoPanelComponent({ visible: false });
          checkSunBurstChartUIComponent({ visible: false });
          checkSunBurstNotVisiblePanelComponent({
            visible: false,
            fitsOnScreen: false,
          });
          checkFunctions({ layoutType: "wide", visible: false });
        });
      });
    });
  });
});
