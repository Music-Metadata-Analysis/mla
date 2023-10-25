import { Flex } from "@chakra-ui/react";
import settings from "@src/config/flip.card";
import FlipCardContainer from "@src/web/reports/generics/components/report.base/flip.card/flip.card.container";
import ReportTitleContainer from "@src/web/reports/generics/components/report.title/report.title.container";
import type { FlipCardControllerHookType } from "./controllers/flip.card.controller.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type LastFMReportFlipCardBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import type LastFMReportQueryAbstractBaseClass from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";

export interface FlipCardReportProps<
  ReportEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation,
  ReportDataType extends unknown[],
> {
  flipCardController: FlipCardControllerHookType;
  imageIsLoaded: () => void;
  query: LastFMReportQueryAbstractBaseClass<
    ReportEncapsulation,
    ReportDataType
  >;
  reportStateInstance: ReportEncapsulation;
  t: tFunctionType;
}

export default function FlipCardReport<
  ReportEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation,
  ReportDataType extends unknown[],
>({
  flipCardController,
  imageIsLoaded,
  query,
  reportStateInstance,
  t,
}: FlipCardReportProps<ReportEncapsulation, ReportDataType>) {
  const DrawerComponent = query.getDrawerComponent();

  return (
    <Flex
      height={"calc(100vh - 80px)"}
      overflowY={"scroll"}
      pt={75}
      pl={50}
      pr={50}
      style={{
        display: reportStateInstance.reportProperties.ready ? "inline" : "none",
      }}
    >
      <DrawerComponent
        artWorkAltTranslatedText={t(
          query.getDrawerArtWorkAltTextTranslationKey()
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
            title={t(`${String(query.getReportTranslationKey())}.title`)}
            userName={reportStateInstance.reportProperties.userName}
            size={settings.cardSize}
          />
          {query
            .getReportData(reportStateInstance.reportProperties)
            .map((_, index) => {
              const noArtWorkString = t(
                `${String(query.getReportTranslationKey())}.noArtWork`
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
