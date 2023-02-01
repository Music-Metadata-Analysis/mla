import { Box, Center, Img, Text } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import ReactCardFlip from "react-card-flip";
import FlipCard, { FlipCardProps } from "../flip.card.component";
import { testIDs } from "../flip.card.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock([
    "Box",
    "Center",
    "Img",
    "Center",
    "Text",
  ])
);

jest.mock("react-card-flip", () =>
  require("@fixtures/react/parent").createComponent("ReactCardFlip")
);

describe("FlipCard", () => {
  let currentProps: FlipCardProps;
  const mockBorderSize = 1;

  const mockOnClick = jest.fn();
  const mockOnLoad = jest.fn();
  const mockOnLoadError = jest.fn();
  const mockT = new MockUseTranslation("cards").t;

  const baseProps: FlipCardProps = {
    cardSize: 50,
    currentlyFlipped: null,
    hasLoadError: false,
    imageFrontActiveSrc: "/test/image.jpg",
    imageRearSrc: "/test/rearImage.jpg",
    index: 1,
    noArtWorkText: "No Cover Art Found",
    onClick: mockOnClick,
    onLoad: mockOnLoad,
    onLoadError: mockOnLoadError,
    t: mockT,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const arrange = () => {
    return render(<FlipCard {...currentProps} />);
  };

  const checkReactCardFlipProps = () => {
    it("should render the ReactCardFlip component with the correct props", () => {
      expect(ReactCardFlip).toBeCalledTimes(1);
      checkMockCall(
        ReactCardFlip,
        {
          containerStyle: {
            margin: 2,
            width: currentProps.cardSize,
            height: currentProps.cardSize,
          },
          isFlipped: currentProps.currentlyFlipped === currentProps.index,
          flipDirection: "horizontal",
        },
        0
      );
    });
  };

  const checkChakraBoxProps = () => {
    it("should render the chakra Box component with the correct props", () => {
      expect(Box).toBeCalledTimes(4);
      checkMockCall(
        Box,
        {
          borderWidth: mockBorderSize,
          borderColor: mockColourHook.flipCardColour.border,
          bg: mockColourHook.flipCardColour.background,
          color: mockColourHook.flipCardColour.foreground,
          width: currentProps.cardSize,
          height: currentProps.cardSize,
          cursor: "pointer",
          sx: {
            "&:hover": {
              opacity: 0.5,
            },
          },
        },
        0
      );
      checkMockCall(
        Box,
        {
          style: { border: "2px" },
        },
        1
      );
      checkMockCall(
        Box,
        {
          borderWidth: mockBorderSize,
          borderColor: mockColourHook.flipCardColour.border,
          bg: mockColourHook.flipCardColour.background,
          color: mockColourHook.flipCardColour.foreground,
          width: currentProps.cardSize,
          height: currentProps.cardSize,
          cursor: "pointer",
          sx: {
            "&:hover": {
              opacity: 0.5,
            },
          },
        },
        2
      );
      checkMockCall(
        Box,
        {
          style: { border: "2px" },
        },
        3
      );
    });
  };

  const checkChakraCenterProps = () => {
    it("should render the chakra Center component with the correct props", () => {
      expect(Center).toBeCalledTimes(2);
      checkMockCall(
        Center,
        {
          width: `${currentProps.cardSize - mockBorderSize * 2}px`,
          height: `${currentProps.cardSize - mockBorderSize * 2}px`,
        },
        0
      );
      checkMockCall(
        Center,
        {
          width: `${currentProps.cardSize - mockBorderSize * 2}px`,
          height: `${currentProps.cardSize - mockBorderSize * 2}px`,
        },
        1
      );
    });
  };

  const checkChakraImageProps = () => {
    it("should render the chakra Center component with the correct props", () => {
      expect(Img).toBeCalledTimes(2);
      checkMockCall(
        Img,
        {
          alt: `${mockT("frontAltText")}: ${currentProps.index + 1}`,
          "data-testid": testIDs.flipFrontImage,
          height: `${currentProps.cardSize - mockBorderSize * 2}px`,
          onError: currentProps.onLoadError,
          onLoad: currentProps.onLoad,
          src: currentProps.imageFrontActiveSrc,
          style: { position: "relative" },
          width: `${currentProps.cardSize - mockBorderSize * 2}px`,
        },
        0
      );
      checkMockCall(
        Img,
        {
          alt: `${mockT("rearAltText")}: ${currentProps.index + 1}`,
          "data-testid": testIDs.flipRearImage,
          height: `${currentProps.cardSize - mockBorderSize * 2}px`,
          onLoad: currentProps.onLoad,
          src: currentProps.imageRearSrc,
          style: { position: "relative", opacity: 0.5 },
          width: `${currentProps.cardSize - mockBorderSize * 2}px`,
        },
        1
      );
    });
  };

  const checkChakraTextPropsWithFront = () => {
    it("should render the chakra Text component with the correct props", () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          color: mockColourHook.flipCardColour.textFront,
          "data-testid": testIDs.flipFrontText,
          fontSize: "sm",
          style: { position: "absolute" },
        },
        0
      );
      checkMockCall(
        Text,
        {
          color: mockColourHook.flipCardColour.textRear,
          "data-testid": testIDs.flipRearText,
          fontSize: "3xl",
          style: { position: "absolute" },
        },
        1
      );
    });
  };

  const checkChakraTextPropsWithOutFront = () => {
    it("should render the chakra Text component with the correct props", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          color: mockColourHook.flipCardColour.textRear,
          "data-testid": testIDs.flipRearText,
          fontSize: "3xl",
          style: { position: "absolute" },
        },
        0
      );
    });
  };

  const checkChakraTextContent = ({
    testId,
    text,
  }: {
    testId: string;
    text: string;
  }) => {
    it(`should render the correct text inside the chakra Text component (test id: ${testId})`, async () => {
      const element = await screen.findByTestId(testId);
      expect(
        await within(element.parentElement as HTMLElement).findByText(text)
      ).toBeTruthy();
    });
  };

  describe("when there is NOT a load error", () => {
    beforeEach(() => (currentProps.hasLoadError = false));

    describe("when the card is flipped", () => {
      beforeEach(() => {
        currentProps.currentlyFlipped = 1;
        currentProps.index = 1;

        arrange();
      });

      checkReactCardFlipProps();
      checkChakraBoxProps();
      checkChakraCenterProps();
      checkChakraImageProps();
      checkChakraTextPropsWithOutFront();
      checkChakraTextContent({
        testId: testIDs.flipRearImage,
        text: "2",
      });
    });

    describe("when the card is NOT flipped", () => {
      beforeEach(() => {
        currentProps.currentlyFlipped = null;
        currentProps.index = 1;

        arrange();
      });

      checkReactCardFlipProps();
      checkChakraBoxProps();
      checkChakraCenterProps();
      checkChakraImageProps();
      checkChakraTextPropsWithOutFront();
      checkChakraTextContent({
        testId: testIDs.flipRearImage,
        text: "2",
      });
    });
  });

  describe("when there is a load error", () => {
    beforeEach(() => (currentProps.hasLoadError = true));

    describe("when the card is flipped", () => {
      beforeEach(() => {
        currentProps.currentlyFlipped = 1;
        currentProps.index = 1;

        arrange();
      });

      checkReactCardFlipProps();
      checkChakraBoxProps();
      checkChakraCenterProps();
      checkChakraImageProps();
      checkChakraTextPropsWithFront();
      checkChakraTextContent({
        testId: testIDs.flipFrontImage,
        text: baseProps.noArtWorkText,
      });
      checkChakraTextContent({
        testId: testIDs.flipRearImage,
        text: "2",
      });
    });

    describe("when the card is NOT flipped", () => {
      beforeEach(() => {
        currentProps.currentlyFlipped = null;
        currentProps.index = 1;

        arrange();
      });

      checkReactCardFlipProps();
      checkChakraBoxProps();
      checkChakraCenterProps();
      checkChakraImageProps();
      checkChakraTextPropsWithFront();
      checkChakraTextContent({
        testId: testIDs.flipFrontImage,
        text: baseProps.noArtWorkText,
      });
      checkChakraTextContent({
        testId: testIDs.flipRearImage,
        text: "2",
      });
    });
  });
});
