import { Flex, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumDrawer from "./drawer.album/drawer.album.component";
import LastFMTop20AlbumReport from "../../../../reports/lastfm/top20.class";
import FlipCard from "../../../flip.card/flip.card.component";
import ReportTitle from "../../common/report.title/report.title.component";
import type useLastFM from "../../../../hooks/lastfm";

export interface Top20ReportProps {
  user: ReturnType<typeof useLastFM>;
  imageIsLoaded: () => void;
  visible: boolean;
}

export default function Top20Report({
  user,
  imageIsLoaded,
  visible,
}: Top20ReportProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentlyFlipped, flipperController] = useState<null | number>(null);
  const { t } = useTranslation("lastfm");
  const cardSize = 100;
  const maxWidth = 4 * cardSize + 20;

  const top20GetAlbumArtWork = (index: number, size: string): string => {
    const image = new LastFMTop20AlbumReport(user.userProperties);
    return image.getAlbumArtWork(index, size);
  };

  const flipper = (index: null | number) => {
    flipperController(index);
    onOpen();
  };

  const closeDrawer = () => {
    flipperController(null);
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
      <AlbumDrawer
        albums={user.userProperties.data.report.albums}
        albumIndex={currentlyFlipped}
        fallbackImage={"/images/static.gif"}
        isOpen={isOpen}
        onClose={closeDrawer}
        top20GetAlbumArtWork={top20GetAlbumArtWork}
        t={t}
      />
      <Flex alignItems={"baseline"} justifyContent={"center"}>
        <Flex
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"center"}
          maxWidth={`${maxWidth}px`}
        >
          <ReportTitle
            title={t("top20.title")}
            userName={user.userProperties.userName}
            size={cardSize}
          />
          {user.userProperties.data.report.albums.map((_, index) => (
            <FlipCard
              key={index}
              size={cardSize}
              image={top20GetAlbumArtWork(index, "large")}
              index={index}
              currentlyFlipped={currentlyFlipped}
              flipperController={flipper}
              imageIsLoaded={imageIsLoaded}
              fallbackImage={"/images/static.gif"}
              rearImage={"/images/record-player.jpg"}
              t={t}
            />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
