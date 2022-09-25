import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect } from "react";
import * as layout from "./layout/sunburst.report.layout";
import useSunBurstLayout from "./layout/sunburst.report.layout.hook";
import SunBurstControlPanel from "./panels/control.panel.component";
import SunBurstInfoPanel from "./panels/info.panel.component";
import SunBurstNotVisiblePanel from "./panels/not.visible.panel.component";
import SunBurstTitlePanel from "./panels/title.panel.component";
import Condition from "@src/components/condition/condition.component";
import SunBurstChartUI from "@src/components/reports/common/sunburst/chart.ui.component";
import settings from "@src/config/sunburst";
import useAnalytics from "@src/hooks/analytics";
import useNavBar from "@src/hooks/navbar";
import useSunBurstState from "@src/hooks/sunburst";
import type SunBurstBaseReport from "./sunburst.report.base.class";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { d3Node } from "@src/types/reports/sunburst.types";

export interface SunBurstReportProps<T extends UserState<unknown>> {
  report: SunBurstBaseReport<T>;
  lastFMt: tFunctionType;
  sunBurstT: tFunctionType;
  userState: T;
  visible: boolean;
}

export type SunburstReportLayoutType = {
  flexDirection: "row" | "column";
  alignItems: "center" | "flex-start";
};

export const SunBurstReportLayouts: {
  [key: string]: SunburstReportLayoutType;
} = {
  compact: {
    flexDirection: "column",
    alignItems: "center",
  },
  normal: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
};

export default function SunBurstReport<
  UserStateType extends UserState<unknown>
>({
  report,
  lastFMt,
  sunBurstT,
  userState,
  visible,
}: SunBurstReportProps<UserStateType>) {
  const analytics = useAnalytics();
  const { setters: sunBurstSetters, getters: sunBurstGetters } =
    useSunBurstState();
  const {
    setters: layoutSetters,
    getters: layoutGetters,
    sections,
  } = useSunBurstLayout();
  const { setters: navBarSetters } = useNavBar();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const DrawerComponent = report.getDrawerComponent();
  const breakPoints = [250, 250, 300, 500, 600, 600];

  const finishSvgTransition = () => sunBurstSetters.setSvgTransition(false);

  const updateLayout = () => {
    layoutSetters.setFitsOnScreen(layout.canFitOnScreen());
    layoutSetters.setCurrentLayout(
      layout.getLayoutType(sections.info, sections.chart)
    );
  };

  const selectNode = (node: d3Node) => {
    sunBurstSetters.setSvgTransition(true);
    sunBurstSetters.setSelectedNode(node);
  };

  const openDrawer = () => {
    navBarSetters.disableHamburger();
    onOpen();
  };

  const closeDrawer = () => {
    navBarSetters.enableHamburger();
    onClose();
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    analytics.event(
      report.getEncapsulatedNode(sunBurstGetters.selectedNode).getDrawerEvent()
    );
    updateLayout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunBurstGetters.selectedNode]);

  return (
    <Flex
      display={visible ? "inline" : "none"}
      mt={75}
      pl={50}
      pr={50}
      height={`calc(100vh - ${settings.navbarOffset}px)`}
      flexDirection={"column"}
    >
      <Condition isTrue={visible}>
        <Box display={layoutGetters.fitsOnScreen ? "inline" : "none"}>
          <DrawerComponent
            alignment={"left"}
            node={report.getEncapsulatedNode(sunBurstGetters.selectedNode)}
            isOpen={isOpen}
            onClose={closeDrawer}
            setSelectedNode={selectNode}
            lastFMt={lastFMt}
            sunBurstT={sunBurstT}
            svgTransition={sunBurstGetters.svgTransition}
          />

          <Flex
            justifyContent={"center"}
            mt={50}
            flexWrap={"wrap"}
            {...SunBurstReportLayouts[layoutGetters.currentLayout]}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <div ref={sections.info}>
                <SunBurstTitlePanel
                  breakPoints={breakPoints}
                  userName={userState.userProperties.userName as string}
                  title={lastFMt(
                    `${String(report.getReportTranslationKey())}.title`
                  )}
                />
                <SunBurstControlPanel
                  breakPoints={breakPoints}
                  isOpen={isOpen}
                  node={report.getEncapsulatedNode(
                    sunBurstGetters.selectedNode
                  )}
                  lastFMt={lastFMt}
                  openDrawer={openDrawer}
                  setSelectedNode={selectNode}
                />
                <SunBurstInfoPanel
                  breakPoints={breakPoints}
                  message={sunBurstT("info.interaction")}
                />
              </div>
            </Flex>
            <div ref={sections.chart}>
              <SunBurstChartUI
                breakPoints={breakPoints}
                data={report.getSunBurstData(
                  userState.userProperties,
                  lastFMt(`${String(report.getReportTranslationKey())}.rootTag`)
                )}
                finishTransition={finishSvgTransition}
                leafEntity={report.getEntityLeaf()}
                selectedNode={sunBurstGetters.selectedNode}
                setSelectedNode={selectNode}
              />
            </div>
          </Flex>
        </Box>
        <Condition isTrue={!layoutGetters.fitsOnScreen}>
          <SunBurstNotVisiblePanel
            breakPoints={breakPoints}
            message={sunBurstT("errors.screenSize")}
          />
        </Condition>
      </Condition>
    </Flex>
  );
}
