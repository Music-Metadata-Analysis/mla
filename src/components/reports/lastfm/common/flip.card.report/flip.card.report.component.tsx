import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import Condition from "@src/components/condition/condition.component";
import FlipCard from "@src/components/flip.card/flip.card.component";
import ReportTitle from "@src/components/reports/common/report.title/report.title.component";
import useLocale from "@src/hooks/locale";
import type FlipCardBaseReport from "../flip.card.report/flip.card.report.base.class";
import type UserState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";

export interface FlipCardReportProps<T extends UserState> {
  imageIsLoaded: () => void;
  report: FlipCardBaseReport<T>;
  t: tFunctionType;
  userState: T;
  visible: boolean;
}

export default function FlipCardReport<UserStateType extends UserState>({
  imageIsLoaded,
  report,
  t,
  userState,
  visible,
}: FlipCardReportProps<UserStateType>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentlyFlipped, flipCard] = useState<null | number>(null);
  const { t: cardTranslations } = useLocale("cards");
  const cardSize = 100;
  const maxWidth = 4 * cardSize + 20;
  const DrawerComponent = report.getDrawerComponent();
  const flipCardImageSize = "large";

  const flipper = (index: null | number) => {
    flipCard(index);
    onOpen();
  };

  const closeDrawer = () => {
    flipCard(null);
    onClose();
  };

  if (userState.userProperties.inProgress) return null;

  return (
    <Flex
      style={{
        display: visible ? "inline" : "none",
      }}
      overflowY={"scroll"}
      pt={75}
      pl={50}
      pr={50}
      height={"calc(100vh - 80px)"}
    >
      <Condition isTrue={isOpen}>
        <DrawerComponent
          artWorkAltText={report.getDrawerArtWorkAltText()}
          objectIndex={currentlyFlipped as number}
          fallbackImage={"/images/static.gif"}
          isOpen={isOpen}
          onClose={closeDrawer}
          t={t}
          userState={userState}
        />
      </Condition>
      <Flex alignItems={"baseline"} justifyContent={"center"}>
        <Flex
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
          maxWidth={`${maxWidth}px`}
        >
          <ReportTitle
            title={t(`${String(report.getReportTranslationKey())}.title`)}
            userName={userState.userProperties.userName}
            size={cardSize}
          />
          {report.getFlipCardData(userState.userProperties).map((_, index) => (
            <FlipCard
              key={index}
              currentlyFlipped={currentlyFlipped}
              fallbackImage={"/images/static.gif"}
              flipperController={flipper}
              imageIsLoaded={imageIsLoaded}
              image={userState.getArtwork(index, flipCardImageSize)}
              index={index}
              noArtWork={t(
                `${String(report.getReportTranslationKey())}.noArtWork`
              )}
              rearImage={"/images/record-player.jpg"}
              size={cardSize}
              t={cardTranslations}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
