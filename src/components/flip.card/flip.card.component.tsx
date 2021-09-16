import { Box, useColorModeValue, Img, Center, Text } from "@chakra-ui/react";
import { useState } from "react";
import ReactCardFlip from "react-card-flip";
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
  rearImage,
  size,
  flipperController,
  imageIsLoaded,
  t,
}: FlipCardProps) {
  const bg = useColorModeValue("gray.900", "gray.300");
  const fc = useColorModeValue("gray.200", "gray.800");
  const bc = useColorModeValue("gray.500", "gray.900");
  const frontOverlayTextColor = "gray.800";
  const rearOverlayTextColor = useColorModeValue("gray.300", "gray.800");
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
        borderColor={bc}
        bg={bg}
        color={fc}
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
              src={image}
              alt={`${t("top20.flipCardFrontAltText")}: ${index + 1}`}
              width={`${size - border * 2}px`}
              height={`${size - border * 2}px`}
              onLoad={() => imageIsLoaded()}
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = fallbackImage;
                setError(true);
              }}
              style={{
                position: "relative",
              }}
            />
            {hasError ? (
              <Text
                data-testid={testIDs.flipFrontText}
                style={{ position: "absolute" }}
                fontSize={"sm"}
                color={frontOverlayTextColor}
              >
                <strong>{`${t("top20.noCover")}`}</strong>
              </Text>
            ) : null}
          </Center>
        </div>
      </Box>

      <Box
        borderWidth={border}
        borderColor={bc}
        bg={bg}
        color={fc}
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
              alt={`${t("top20.flipCardRearAltText")}: ${index + 1}`}
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
              color={rearOverlayTextColor}
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
