import { Box, Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import mockSunBurstLayoutControllerHook from "../controllers/__mocks__/sunburst.report.layout.controller.hook.mock";
import SunBurstControlPanel from "../panels/control/control.panel.component";
import SunBurstErrorPanel from "../panels/error/error.panel.component";
import SunBurstInfoPanel from "../panels/info/info.panel.component";
import SunBurstTitlePanel from "../panels/title/title.panel.component";
import SunBurstReport, {
  SunBurstReportProps,
} from "../sunburst.report.component";
import settings from "@src/config/sunburst";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockSunBurstControllerHook from "@src/hooks/controllers/__mocks__/sunburst.controller.hook.mock";
import nullNode from "@src/providers/user/reports/sunburst.node.initial";
import SunBurstChart from "@src/web/reports/generics/components/charts/sunburst/sunburst.component";
import { MockReportClass } from "@src/web/reports/lastfm/generics/components/report.class/tests/implementations/concrete.sunburst.report.class";
import MockSunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/tests/implementations/concrete.sunburst.node.encapsulation.class";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { d3Node } from "@src/web/reports/generics/types/charts/sunburst.types";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box", "Flex"])
);

jest.mock(
  "@src/web/reports/generics/components/charts/sunburst/sunburst.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstChart")
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/control/control.panel.component",
  () =>
    require("@fixtures/react/parent").createComponent("SunBurstControlPanel")
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/error/error.panel.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstErrorPanel")
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/info/info.panel.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstInfoPanel")
);

jest.mock(
  "@src/web/reports/lastfm/generics/components/report.component/sunburst/panels/title/title.panel.component",
  () => require("@fixtures/react/parent").createComponent("SunBurstTitlePanel")
);

describe("SunBurstReport", () => {
  let currentProps: SunBurstReportProps<UserState<unknown>>;
  let mockVisible: boolean;

  const expectedBreakPoints = [250, 250, 300, 500, 600, 600];
  const mockNode = { data: { name: "mockNode", entity: "unknown" as const } };
  const mockReport = new MockReportClass();
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

  const mockLastFMt = jest.fn((key: string) => `lastFMt(${key})`);
  const mockSunBurstT = jest.fn((key: string) => `sunBurstT(${key})`);

  beforeEach(() => {
    jest.clearAllMocks();
    arrangeMockSelectedNode();
    arrangeProps();
  });

  const arrange = () => {
    render(<SunBurstReport {...currentProps} />);
  };

  const arrangeMockSelectedNode = () => {
    mockSunBurstControllerHook.node.selected ===
      (JSON.parse(JSON.stringify(nullNode)) as d3Node);
    mockSunBurstControllerHook.node.selected.data = mockNode.data;
  };

  const arrangeProps = () =>
    (currentProps = {
      encapsulatedReportState: mockUserState,
      lastFMt: mockLastFMt,
      report: mockReport,
      sunBurstController: mockSunBurstControllerHook,
      sunBurstLayoutController: mockSunBurstLayoutControllerHook,
      sunBurstT: mockSunBurstT,
      visible: mockVisible,
    });

  const assertComponentHasCalls = ({
    calls,
    component,
    componentName,
  }: {
    calls: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: (...args: any[]) => JSX.Element | null;
    componentName: string;
  }) => {
    it(`should render the ${componentName} component ${calls} time(s)`, () => {
      expect(component).toBeCalledTimes(calls);
    });
  };

  const checkChakraFlex = ({
    calls,
    display,
    layoutProps,
  }: {
    calls: number;
    display: "inline" | "none";
    layoutProps: {
      flexDirection: "row" | "column";
      alignItems: "flex-start" | "center";
    };
  }) => {
    assertComponentHasCalls({ calls, component: Flex, componentName: "Flex" });

    if (calls > 0) {
      it("should render the top level Flex component correctly", () => {
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
    }

    if (calls > 1) {
      it("should render the layout control Flex component correctly", () => {
        checkMockCall(
          Flex,
          {
            mt: 50,
            justifyContent: "center",
            flexWrap: "wrap",
            ...layoutProps,
          },
          1,
          []
        );
      });
    }

    if (calls > 2) {
      it("should render the info section Flex component correctly", () => {
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
    }
  };

  const checkChakraBoxComponent = ({
    calls,
    display,
  }: {
    calls: number;
    display: string;
  }) => {
    assertComponentHasCalls({ calls, component: Box, componentName: "Box" });

    if (calls > 0) {
      it("should render the top level Box with the correct props", () => {
        checkMockCall(Box, { display }, 0);
      });
    }
  };

  const checkDrawerComponent = ({ calls }: { calls: number }) => {
    assertComponentHasCalls({
      calls,
      component: mockReport.getDrawerComponent(),
      componentName: "DrawerComponent",
    });

    if (calls > 0) {
      it("should render the DrawerComponent with the correct props", () => {
        const DrawerComponent = mockReport.getDrawerComponent();

        checkMockCall(
          DrawerComponent,
          {
            alignment: "left",
            isOpen: mockSunBurstControllerHook.drawer.state,
            node: mockReport.getEncapsulatedNode(nullNode as d3Node),
            onClose: mockSunBurstControllerHook.drawer.setFalse,
            setSelectedNode: mockSunBurstControllerHook.node.setSelected,
            svgTransition: mockSunBurstControllerHook.svg.isTransitioning,
          },
          0,
          [],
          false,
          [{ name: "node", class: MockSunBurstNodeAbstractBase }]
        );
      });
    }
  };

  const checkSunBurstTitlePanelComponent = ({ calls }: { calls: number }) => {
    assertComponentHasCalls({
      calls,
      component: SunBurstTitlePanel,
      componentName: "SunBurstTitlePanel",
    });

    if (calls > 0) {
      it("should render the SunBurstTitlePanel component correctly", () => {
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
    }
  };

  const checkSunBurstControlPanelComponent = ({ calls }: { calls: number }) => {
    assertComponentHasCalls({
      calls,
      component: SunBurstControlPanel,
      componentName: "SunBurstControlPanel",
    });

    if (calls > 0) {
      it("should render the SunBurstControlPanel component correctly", () => {
        expect(SunBurstControlPanel).toBeCalledTimes(1);
        checkMockCall(
          SunBurstControlPanel,
          {
            breakPoints: expectedBreakPoints,
            isOpen: mockSunBurstControllerHook.drawer.state,
            lastFMt: mockLastFMt,
            node: mockReport.getEncapsulatedNode(nullNode as d3Node),
            openDrawer: mockSunBurstControllerHook.drawer.setTrue,
            setSelectedNode: mockSunBurstControllerHook.node.setSelected,
          },
          0,
          [],
          false,
          [{ name: "node", class: MockSunBurstNodeAbstractBase }]
        );
      });
    }
  };

  const checkSunBurstInfoPanelComponent = ({ calls }: { calls: number }) => {
    assertComponentHasCalls({
      calls,
      component: SunBurstInfoPanel,
      componentName: "SunBurstInfoPanel",
    });

    if (calls > 0) {
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
    }
  };

  const checkSunBurstChartComponent = ({ calls }: { calls: number }) => {
    assertComponentHasCalls({
      calls,
      component: SunBurstChart,
      componentName: "SunBurstChart",
    });

    if (calls > 0) {
      it("should call the SunBurstChart component correctly", () => {
        expect(SunBurstChart).toBeCalledTimes(1);
        checkMockCall(
          SunBurstChart,
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
            setSelectedNode: mockSunBurstControllerHook.node.setSelected,
          },
          0,
          ["finishTransition"]
        );
      });

      describe("when the finishTransition function is called", () => {
        let finishTransition: () => void;

        beforeEach(() => {
          finishTransition =
            jest.mocked(SunBurstChart).mock.calls[0][0].finishTransition;

          finishTransition();
        });

        it("should call the underlying hook function correctly", () => {
          expect(
            mockSunBurstControllerHook.svg.setTransitioning
          ).toBeCalledTimes(1);
          expect(
            mockSunBurstControllerHook.svg.setTransitioning
          ).toBeCalledWith(false);
        });
      });
    }
  };

  const checkSunBurstNotVisiblePanelComponent = ({
    calls,
  }: {
    calls: number;
  }) => {
    assertComponentHasCalls({
      calls,
      component: SunBurstErrorPanel,
      componentName: "SunBurstNotVisiblePanel",
    });

    if (calls > 0) {
      it("should call the SunBurstNotVisiblePanel component", () => {
        expect(SunBurstErrorPanel).toBeCalledTimes(1);
        checkMockCall(
          SunBurstErrorPanel,
          {
            breakPoints: expectedBreakPoints,
            message: mockSunBurstT("errors.screenSize"),
          },
          0,
          []
        );
      });
    }
  };

  describe("when visible is 'true'", () => {
    beforeEach(() => (currentProps.visible = true));

    describe("when canFitOnScreen is 'true'", () => {
      beforeEach(() => {
        mockSunBurstLayoutControllerHook.canFitOnScreen = true;

        arrange();
      });

      checkChakraFlex({
        calls: 3,
        display: "inline",
        layoutProps: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
      });
      checkChakraBoxComponent({ calls: 1, display: "inline" });
      checkDrawerComponent({ calls: 1 });
      checkSunBurstTitlePanelComponent({ calls: 1 });
      checkSunBurstControlPanelComponent({ calls: 1 });
      checkSunBurstInfoPanelComponent({ calls: 1 });
      checkSunBurstChartComponent({ calls: 1 });
      checkSunBurstNotVisiblePanelComponent({ calls: 0 });
    });

    describe("when canFitOnScreen is 'false'", () => {
      beforeEach(() => {
        mockSunBurstLayoutControllerHook.canFitOnScreen = false;

        arrange();
      });

      checkChakraFlex({
        calls: 3,
        display: "inline",
        layoutProps: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
      });
      checkChakraBoxComponent({ calls: 1, display: "none" });
      checkDrawerComponent({ calls: 1 });
      checkSunBurstTitlePanelComponent({ calls: 1 });
      checkSunBurstControlPanelComponent({ calls: 1 });
      checkSunBurstInfoPanelComponent({ calls: 1 });
      checkSunBurstChartComponent({ calls: 1 });
      checkSunBurstNotVisiblePanelComponent({ calls: 1 });
    });
  });

  describe("when visible is 'false'", () => {
    beforeEach(() => (currentProps.visible = false));

    describe("when canFitOnScreen is 'true'", () => {
      beforeEach(() => {
        mockSunBurstLayoutControllerHook.canFitOnScreen = true;

        arrange();
      });

      checkChakraFlex({
        calls: 1,
        display: "none",
        layoutProps: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
      });
      checkChakraBoxComponent({ calls: 0, display: "inline" });
      checkDrawerComponent({ calls: 0 });
      checkSunBurstTitlePanelComponent({ calls: 0 });
      checkSunBurstControlPanelComponent({ calls: 0 });
      checkSunBurstInfoPanelComponent({ calls: 0 });
      checkSunBurstChartComponent({ calls: 0 });
      checkSunBurstNotVisiblePanelComponent({ calls: 0 });
    });
  });

  describe("when canFitOnScreen is 'false'", () => {
    beforeEach(() => {
      mockSunBurstLayoutControllerHook.canFitOnScreen = false;

      arrange();
    });

    checkChakraFlex({
      calls: 1,
      display: "none",
      layoutProps: {
        flexDirection: "row",
        alignItems: "flex-start",
      },
    });
    checkChakraBoxComponent({ calls: 0, display: "none" });
    checkDrawerComponent({ calls: 0 });
    checkSunBurstTitlePanelComponent({ calls: 0 });
    checkSunBurstControlPanelComponent({ calls: 0 });
    checkSunBurstInfoPanelComponent({ calls: 0 });
    checkSunBurstChartComponent({ calls: 0 });
    checkSunBurstNotVisiblePanelComponent({ calls: 0 });
  });
});
