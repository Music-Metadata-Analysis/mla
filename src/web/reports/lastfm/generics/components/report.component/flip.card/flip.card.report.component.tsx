import { Flex } from "@chakra-ui/react";
import settings from "@src/config/flip.card";
import FlipCardContainer from "@src/web/reports/generics/components/charts/flip.card/flip.card.container";
import ReportTitleContainer from "@src/web/reports/generics/components/report.title/report.title.container";
import type { FlipCardControllerHookType } from "./controllers/flip.card.controller.hook";
import type UserState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type FlipCardBaseReport from "@src/web/reports/lastfm/generics/components/report.class/flip.card.report.base.class";

export interface FlipCardReportProps<
  UserStateType extends UserState,
  ReportDataType extends unknown[]
> {
  flipCardController: FlipCardControllerHookType;
  imageIsLoaded: () => void;
  report: FlipCardBaseReport<UserStateType, ReportDataType>;
  reportStateInstance: UserStateType;
  t: tFunctionType;
}

export default function FlipCardReport<
  UserStateType extends UserState,
  ReportDataType extends unknown[]
>({
  flipCardController,
  imageIsLoaded,
  report,
  reportStateInstance,
  t,
}: FlipCardReportProps<UserStateType, ReportDataType>) {
  const DrawerComponent = report.getDrawerComponent();

  return (
    <Flex
      height={"calc(100vh - 80px)"}
      overflowY={"scroll"}
      pt={75}
      pl={50}
      pr={50}
      style={{
        display: reportStateInstance.userProperties.ready ? "inline" : "none",
      }}
    >
      <DrawerComponent
        artWorkAltTranslatedText={t(
          report.getDrawerArtWorkAltTextTranslationKey()
        )}
        fallbackImage={"/images/static.gif"}
        isOpen={flipCardController.drawer.state}
        objectIndex={flipCardController.card.state}
        onClose={flipCardController.drawer.setFalse}
        reportStateInstance={reportStateInstance}
      />
      <Flex alignItems={"baseline"} justifyContent={"center"}>
        <Flex
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
          maxWidth={`${settings.maxWidth}px`}
        >
          <ReportTitleContainer
            title={t(`${String(report.getReportTranslationKey())}.title`)}
            userName={reportStateInstance.userProperties.userName}
            size={settings.cardSize}
          />
          {report
            .getReportData(reportStateInstance.userProperties)
            .map((_, index) => {
              const noArtWorkString = t(
                `${String(report.getReportTranslationKey())}.noArtWork`
              );

              return (
                <FlipCardContainer
                  key={index}
                  cardSize={settings.cardSize}
                  currentlyFlipped={flipCardController.card.state}
                  imageFrontFallBack={"/images/static.gif"}
                  imageFrontSrc={reportStateInstance.getArtwork(
                    index,
                    settings.flipCardImageSize
                  )}
                  imageRearSrc={"/images/record-player.jpg"}
                  index={index}
                  flipCard={flipCardController.card.flip}
                  noArtWorkText={noArtWorkString}
                  onLoad={imageIsLoaded}
                />
              );
            })}
        </Flex>
      </Flex>
    </Flex>
  );
}
