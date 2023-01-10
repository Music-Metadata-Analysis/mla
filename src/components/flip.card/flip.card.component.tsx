import { Box, Img, Center, Text } from "@chakra-ui/react";
import ReactCardFlip from "react-card-flip";
import { testIDs } from "./flip.card.identifiers";
import useColour from "@src/hooks/ui/colour.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

export interface FlipCardProps {
  cardSize: number;
  currentlyFlipped: number | null;
  hasLoadError: boolean;
  imageFrontActiveSrc: string;
  imageRearSrc: string;
  index: number;
  noArtWorkText: string;

  onClick: () => void;
  onLoad: () => void;
  onLoadError: () => void;
  t: tFunctionType;
}

export default function FlipCard({
  cardSize,
  currentlyFlipped,
  hasLoadError,
  imageFrontActiveSrc,
  imageRearSrc,
  index,
  noArtWorkText,
  onClick,
  onLoad,
  onLoadError,
  t,
}: FlipCardProps) {
  const { flipCardColour } = useColour();

  const border = 1;

  return (
    <ReactCardFlip
      containerStyle={{ margin: 2, width: cardSize, height: cardSize }}
      isFlipped={currentlyFlipped === index}
      flipDirection="horizontal"
    >
      <Box
        borderWidth={border}
        borderColor={flipCardColour.border}
        bg={flipCardColour.background}
        color={flipCardColour.foreground}
        width={cardSize}
        height={cardSize}
        onClick={onClick}
        cursor={"pointer"}
        sx={{
          "&:hover": {
            opacity: 0.5,
          },
        }}
      >
        <Box style={{ border: "2px" }}>
          <Center
            height={`${cardSize - border * 2}px`}
            width={`${cardSize - border * 2}px`}
          >
            <Img
              alt={`${t("frontAltText")}: ${index + 1}`}
              data-testid={testIDs.flipFrontImage}
              height={`${cardSize - border * 2}px`}
              onError={onLoadError}
              onLoad={onLoad}
              src={imageFrontActiveSrc}
              style={{
                position: "relative",
              }}
              width={`${cardSize - border * 2}px`}
            />
            {hasLoadError ? (
              <Text
                color={flipCardColour.textFront}
                data-testid={testIDs.flipFrontText}
                fontSize={"sm"}
                style={{ position: "absolute" }}
              >
                <strong>{noArtWorkText}</strong>
              </Text>
            ) : null}
          </Center>
        </Box>
      </Box>

      <Box
        borderWidth={border}
        borderColor={flipCardColour.border}
        bg={flipCardColour.background}
        color={flipCardColour.foreground}
        width={cardSize}
        height={cardSize}
        onClick={onClick}
        cursor={"pointer"}
        sx={{
          "&:hover": {
            opacity: 0.5,
          },
        }}
      >
        <Box style={{ border: "2px" }}>
          <Center
            height={`${cardSize - border * 2}px`}
            width={`${cardSize - border * 2}px`}
          >
            <Img
              alt={`${t("rearAltText")}: ${index + 1}`}
              data-testid={testIDs.flipRearImage}
              height={`${cardSize - border * 2}px`}
              onLoad={onLoad}
              src={imageRearSrc}
              style={{
                position: "relative",
                opacity: 0.5,
              }}
              width={`${cardSize - border * 2}px`}
            />
            <Text
              color={flipCardColour.textRear}
              data-testid={testIDs.flipRearText}
              style={{ position: "absolute" }}
              fontSize={"3xl"}
            >
              <strong>{index + 1}</strong>
            </Text>
          </Center>
        </Box>
      </Box>
    </ReactCardFlip>
  );
}
