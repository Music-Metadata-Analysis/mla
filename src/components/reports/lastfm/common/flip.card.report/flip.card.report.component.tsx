import { Flex, useDisclosure } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useState, FC } from "react";
import Condition from "../../../../condition/condition.component";
import FlipCard from "../../../../flip.card/flip.card.component";
import ReportTitle from "../../../common/report.title/report.title.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/user.state.base.class";
import type { LastFMFlipCardCommonDrawerInterface } from "../../../../../types/clients/api/reports/lastfm.client.types";
import type { TFunction } from "next-i18next";

export interface LastFMFlipCardReportProps<T> {
  imageIsLoaded: () => void;
  DrawerComponent: FC<LastFMFlipCardCommonDrawerInterface<T>>;
  flipCardData: unknown[];
  reportTranslationKey: string;
  userState: UserState & T;
  visible: boolean;
  t: TFunction;
}

export default function LastFMFlipCardReport<UserStateType>({
  imageIsLoaded,
  DrawerComponent,
  reportTranslationKey,
  userState,
  flipCardData,
  visible,
  t,
}: LastFMFlipCardReportProps<UserStateType>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentlyFlipped, flipCard] = useState<null | number>(null);
  const { t: cardTranslations } = useTranslation("cards");
  const cardSize = 100;
  const maxWidth = 4 * cardSize + 20;

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
          userState={userState}
          albumIndex={currentlyFlipped as number}
          fallbackImage={"/images/static.gif"}
          isOpen={isOpen}
          onClose={closeDrawer}
          t={t}
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
            title={t(`${String(reportTranslationKey)}.title`)}
            userName={userState.userProperties.userName}
            size={cardSize}
          />
          {flipCardData.map((_, index) => (
            <FlipCard
              key={index}
              currentlyFlipped={currentlyFlipped}
              fallbackImage={"/images/static.gif"}
              flipperController={flipper}
              imageIsLoaded={imageIsLoaded}
              image={userState.getArtwork(index, "large")}
              index={index}
              noArtWork={t(`${String(reportTranslationKey)}.noArtWork`)}
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
