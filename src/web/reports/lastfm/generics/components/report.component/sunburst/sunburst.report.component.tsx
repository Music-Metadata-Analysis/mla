import { Box, Flex } from "@chakra-ui/react";
import SunBurstControlPanel from "./panels/control/control.panel.component";
import SunBurstErrorPanel from "./panels/error/error.panel.component";
import SunBurstInfoPanel from "./panels/info/info.panel.component";
import SunBurstTitlePanel from "./panels/title/title.panel.component";
import settings from "@src/config/sunburst";
import SunBurstChart from "@src/web/reports/generics/components/report.base/sunburst/sunburst.chart.component";
import Condition from "@src/web/ui/generics/components/condition/condition.component";
import type { SunBurstLayoutControllerHookType } from "./controllers/sunburst.report.layout.controller.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { SunBurstControllerHookType } from "@src/web/reports/generics/state/controllers/sunburst/sunburst.controller.hook";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type SunBurstBaseQuery from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";

export interface SunBurstReportProps<
  T extends LastFMReportSunBurstBaseStateEncapsulation<unknown>,
> {
  encapsulatedReportState: T;
  lastFMt: tFunctionType;
  query: SunBurstBaseQuery<T>;
  sunBurstController: SunBurstControllerHookType;
  sunBurstLayoutController: SunBurstLayoutControllerHookType;
  sunBurstT: tFunctionType;
  visible: boolean;
}

export default function SunBurstReport<
  ReportStateType extends LastFMReportSunBurstBaseStateEncapsulation<unknown>,
>({
  encapsulatedReportState,
  lastFMt,
  query,
  sunBurstController,
  sunBurstLayoutController,
  sunBurstT,
  visible,
}: SunBurstReportProps<ReportStateType>) {
  const DrawerComponent = query.getDrawerComponent();
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
            node={query.getEncapsulatedNode(sunBurstController.node.selected)}
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
                    encapsulatedReportState.reportProperties.userName
                  )}
                  title={lastFMt(
                    `${String(query.getReportTranslationKey())}.title`
                  )}
                />
                <SunBurstControlPanel
                  breakPoints={breakPoints}
                  isOpen={sunBurstController.drawer.state}
                  node={query.getEncapsulatedNode(
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
                data={query.getSunBurstData(
                  encapsulatedReportState.reportProperties,
                  lastFMt(`${String(query.getReportTranslationKey())}.rootTag`),
                  lastFMt(
                    `${String(query.getReportTranslationKey())}.remainderTag`
                  )
                )}
                finishTransition={() =>
                  sunBurstController.svg.setTransitioning(false)
                }
                leafEntity={query.getEntityLeaf()}
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
