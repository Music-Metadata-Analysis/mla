import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumDrawer from "./drawer.album/drawer.album.component";
import UserAlbumDataState from "../../../../providers/user/encapsulations/user.state.album.class";
import Condition from "../../../condition/condition.component";
import FlipCard from "../../../flip.card/flip.card.component";
import ReportTitle from "../../common/report.title/report.title.component";
import type { userHookAsLastFMTop20AlbumReport } from "../../../../types/user/hook.types";

export interface Top20AlbumsReportProps {
  user: userHookAsLastFMTop20AlbumReport;
  imageIsLoaded: () => void;
  visible: boolean;
}

export default function Top20AlbumsReport({
  user,
  imageIsLoaded,
  visible,
}: Top20AlbumsReportProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentlyFlipped, flipCard] = useState<null | number>(null);
  const { t: cardTranslations } = useTranslation("cards");
  const { t } = useTranslation("lastfm");
  const userState = new UserAlbumDataState(user.userProperties, t);
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

  if (user.userProperties.inProgress) return null;

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
        <AlbumDrawer
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
            title={t("top20Albums.title")}
            userName={user.userProperties.userName}
            size={cardSize}
          />
          {user.userProperties.data.report.albums.map((_, index) => (
            <FlipCard
              key={index}
              currentlyFlipped={currentlyFlipped}
              fallbackImage={"/images/static.gif"}
              flipperController={flipper}
              imageIsLoaded={imageIsLoaded}
              image={userState.getAlbumArtWork(index, "large")}
              index={index}
              noArtWork={t("top20Albums.noArtWork")}
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
