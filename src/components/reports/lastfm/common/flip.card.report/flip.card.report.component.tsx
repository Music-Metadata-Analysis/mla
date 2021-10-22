import { Flex, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Condition from "../../../../condition/condition.component";
import FlipCard from "../../../../flip.card/flip.card.component";
import ReportTitle from "../../../common/report.title/report.title.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/user.state.base.report.class";
import type FlipCardBaseReport from "../flip.card.report/flip.card.report.base.class";
import type { TFunction } from "next-i18next";

export interface FlipCardReportProps<T extends UserState> {
  imageIsLoaded: () => void;
  report: FlipCardBaseReport<T>;
  t: TFunction;
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
  const { t: cardTranslations } = useTranslation("cards");
  const cardSize = 100;
  const maxWidth = 4 * cardSize + 20;
  const DrawerComponent = report.getDrawerComponent();

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
              image={userState.getArtwork(index, "large")}
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
