import { useState } from "react";
import FlipCard from "./flip.card.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export interface FlipCardContainerProps {
  cardSize: number;
  currentlyFlipped: null | number;
  flipCard: (index: number | null) => void;
  imageFrontFallBack: string;
  imageFrontSrc: string;
  imageRearSrc: string;
  index: number;
  noArtWorkText: string;
  onLoad: () => void;
}

export default function FlipCardContainer({
  cardSize,
  currentlyFlipped,
  imageFrontFallBack,
  imageFrontSrc,
  imageRearSrc,
  flipCard,
  index,
  noArtWorkText,
  onLoad,
}: FlipCardContainerProps) {
  const { t } = useTranslation("cards");
  const [hasLoadError, setLoadError] = useState(false);

  const imageFrontActiveSrc = hasLoadError ? imageFrontFallBack : imageFrontSrc;

  const onClick = () => {
    if (currentlyFlipped === index) {
      flipCard(null);
    } else {
      flipCard(index);
    }
  };

  const onLoadError = () => {
    setLoadError(true);
  };

  return (
    <FlipCard
      cardSize={cardSize}
      currentlyFlipped={currentlyFlipped}
      hasLoadError={hasLoadError}
      imageFrontActiveSrc={imageFrontActiveSrc}
      imageRearSrc={imageRearSrc}
      index={index}
      noArtWorkText={noArtWorkText}
      onClick={onClick}
      onLoad={onLoad}
      onLoadError={onLoadError}
      t={t}
    />
  );
}
