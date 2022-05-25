import { Box, Img, Center, Text } from "@chakra-ui/react";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import useColour from "../../hooks/colour";
import type { TFunction } from "next-i18next";

export interface FlipCardProps {
  currentlyFlipped: null | number;
  fallbackImage: string;
  image: string;
  index: number;
  rearImage: string;
  size: number;
  flipperController: (index: number | null) => void;
  imageIsLoaded: () => void;
  t: TFunction;
  noArtWork: string;
}

export const testIDs = {
  flipFrontImage: "flipFrontImage",
  flipFrontText: "flipFrontText",
  flipRearImage: "flipRearImage",
  flipRearText: "flipRearText",
};

export default function FlipCard({
  currentlyFlipped,
  fallbackImage,
  image,
  index,
  noArtWork,
  rearImage,
  size,
  flipperController,
  imageIsLoaded,
  t,
}: FlipCardProps) {
  const { flipCardColour } = useColour();
  const [hasError, setError] = useState(false);

  const isFlipped = currentlyFlipped === index;
  const border = 1;

  const flipper = () => {
    if (isFlipped) {
      flipperController(null);
    } else {
      flipperController(index);
    }
  };

  return (
    <ReactCardFlip
      containerStyle={{ margin: 2, width: size, height: size }}
      isFlipped={isFlipped}
      flipDirection="horizontal"
    >
      <Box
        borderWidth={border}
        borderColor={flipCardColour.border}
        bg={flipCardColour.background}
        color={flipCardColour.foreground}
        width={size}
        height={size}
        onClick={flipper}
        cursor={"pointer"}
        sx={{
          "&:hover": {
            opacity: 0.5,
          },
        }}
      >
        <div style={{ border: "2px" }}>
          <Center
            width={`${size - border * 2}px`}
            height={`${size - border * 2}px`}
          >
            <Img
              data-testid={testIDs.flipFrontImage}
              src={hasError ? fallbackImage : image}
              alt={`${t("frontAltText")}: ${index + 1}`}
              width={`${size - border * 2}px`}
              height={`${size - border * 2}px`}
              onLoad={() => imageIsLoaded()}
              onError={() => setError(true)}
              style={{
                position: "relative",
              }}
            />
            {hasError ? (
              <Text
                data-testid={testIDs.flipFrontText}
                style={{ position: "absolute" }}
                fontSize={"sm"}
                color={flipCardColour.textFront}
              >
                <strong>{noArtWork}</strong>
              </Text>
            ) : null}
          </Center>
        </div>
      </Box>

      <Box
        borderWidth={border}
        borderColor={flipCardColour.border}
        bg={flipCardColour.background}
        color={flipCardColour.foreground}
        width={size}
        height={size}
        onClick={flipper}
        cursor={"pointer"}
        sx={{
          "&:hover": {
            opacity: 0.5,
          },
        }}
      >
        <div style={{ border: "2px" }}>
          <Center
            width={`${size - border * 2}px`}
            height={`${size - border * 2}px`}
          >
            <Img
              data-testid={testIDs.flipRearImage}
              src={rearImage}
              alt={`${t("rearAltText")}: ${index + 1}`}
              width={`${size - border * 2}px`}
              height={`${size - border * 2}px`}
              onLoad={() => imageIsLoaded()}
              style={{
                position: "relative",
                opacity: 0.5,
              }}
            />
            <Text
              data-testid={testIDs.flipRearText}
              color={flipCardColour.textRear}
              style={{ position: "absolute" }}
              fontSize={"3xl"}
            >
              <strong>{index + 1}</strong>
            </Text>
          </Center>
        </div>
      </Box>
    </ReactCardFlip>
  );
}
