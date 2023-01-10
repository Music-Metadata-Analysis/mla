import { Box, Flex } from "@chakra-ui/react";
import SunBurstControlPanel from "./panels/control/control.panel.component";
import SunBurstErrorPanel from "./panels/error/error.panel.component";
import SunBurstInfoPanel from "./panels/info/info.panel.component";
import SunBurstTitlePanel from "./panels/title/title.panel.component";
import Condition from "@src/components/condition/condition.component";
import SunBurstChart from "@src/components/reports/common/chart/sunburst/chart.component";
import settings from "@src/config/sunburst";
import type { SunBurstLayoutControllerHookType } from "./controllers/sunburst.report.layout.controller.hook";
import type SunBurstBaseReport from "@src/components/reports/lastfm/common/report.class/sunburst.report.base.class";
import type { SunBurstControllerHookType } from "@src/hooks/controllers/sunburst.controller.hook";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export interface SunBurstReportProps<T extends UserState<unknown>> {
  encapsulatedReportState: T;
  lastFMt: tFunctionType;
  report: SunBurstBaseReport<T>;
  sunBurstController: SunBurstControllerHookType;
  sunBurstLayoutController: SunBurstLayoutControllerHookType;
  sunBurstT: tFunctionType;
  visible: boolean;
}

export default function SunBurstReport<
  ReportStateType extends UserState<unknown>
>({
  encapsulatedReportState,
  lastFMt,
  report,
  sunBurstController,
  sunBurstLayoutController,
  sunBurstT,
  visible,
}: SunBurstReportProps<ReportStateType>) {
  const DrawerComponent = report.getDrawerComponent();
  const breakPoints = [250, 250, 300, 500, 600, 600];

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
        <Box
          display={sunBurstLayoutController.canFitOnScreen ? "inline" : "none"}
        >
          <DrawerComponent
            alignment={"left"}
            node={report.getEncapsulatedNode(sunBurstController.node.selected)}
            isOpen={sunBurstController.drawer.state}
            onClose={sunBurstController.drawer.setFalse}
            setSelectedNode={sunBurstController.node.setSelected}
            svgTransition={sunBurstController.svg.isTransitioning}
          />

          <Flex
            justifyContent={"center"}
            mt={50}
            flexWrap={"wrap"}
            {...sunBurstLayoutController.flexProps}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <div ref={sunBurstLayoutController.ref.info}>
                <SunBurstTitlePanel
                  breakPoints={breakPoints}
                  userName={String(
                    encapsulatedReportState.userProperties.userName
                  )}
                  title={lastFMt(
                    `${String(report.getReportTranslationKey())}.title`
                  )}
                />
                <SunBurstControlPanel
                  breakPoints={breakPoints}
                  isOpen={sunBurstController.drawer.state}
                  node={report.getEncapsulatedNode(
                    sunBurstController.node.selected
                  )}
                  lastFMt={lastFMt}
                  openDrawer={sunBurstController.drawer.setTrue}
                  setSelectedNode={sunBurstController.node.setSelected}
                />
                <SunBurstInfoPanel
                  breakPoints={breakPoints}
                  message={sunBurstT("info.interaction")}
                />
              </div>
            </Flex>
            <div ref={sunBurstLayoutController.ref.chart}>
              <SunBurstChart
                breakPoints={breakPoints}
                data={report.getSunBurstData(
                  encapsulatedReportState.userProperties,
                  lastFMt(
                    `${String(report.getReportTranslationKey())}.rootTag`
                  ),
                  lastFMt(
                    `${String(report.getReportTranslationKey())}.remainderTag`
                  )
                )}
                finishTransition={() =>
                  sunBurstController.svg.setTransitioning(false)
                }
                leafEntity={report.getEntityLeaf()}
                selectedNode={sunBurstController.node.selected}
                setSelectedNode={sunBurstController.node.setSelected}
              />
            </div>
          </Flex>
        </Box>
        <Condition isTrue={!sunBurstLayoutController.canFitOnScreen}>
          <SunBurstErrorPanel
            breakPoints={breakPoints}
            message={sunBurstT("errors.screenSize")}
          />
        </Condition>
      </Condition>
    </Flex>
  );
}
