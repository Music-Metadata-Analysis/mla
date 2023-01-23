import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import FlipCardContainer, {
  FlipCardContainerProps,
} from "../flip.card.container";
import { testIDs } from "../flip.card.identifiers";
import cardTranslations from "@locales/cards.json";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

describe("FlipCardContainer", () => {
  let currentProps: FlipCardContainerProps;

  const mockFlipCard = jest.fn();
  const mockOnLoad = jest.fn();

  const baseProps: FlipCardContainerProps = {
    cardSize: 50,
    currentlyFlipped: null,
    flipCard: mockFlipCard,
    imageFrontFallBack: "/test/fallbackImage.jpg",
    imageFrontSrc: "/test/image.jpg",
    imageRearSrc: "/test/rearImage.jpg",
    index: 1,
    noArtWorkText: "No Cover Art Found",
    onLoad: mockOnLoad,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    return render(<FlipCardContainer {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkImage = ({
    altText,
    errorMessage,
    imageSource,
    testId,
  }: {
    altText: string;
    errorMessage?: string;
    imageSource: string;
    testId: string;
  }) => {
    describe(`should render an image with testId: ${testId}`, () => {
      let image: HTMLImageElement;

      beforeEach(async () => {
        image = await screen.findByTestId(testId);
      });

      it(`should render this image as visible`, () => {
        expect(image).toBeVisible();
      });

      it(`should render this image with the correct alternate text: ${altText}`, async () => {
        await waitFor(() =>
          expect(image.parentElement?.children[0]).toHaveAttribute(
            "alt",
            altText
          )
        );
      });

      it(`should render this image with the correct imageSource: ${imageSource}`, async () => {
        await waitFor(() =>
          expect(image.parentElement?.children[0]).toHaveAttribute(
            "src",
            imageSource
          )
        );
      });

      if (errorMessage) {
        it("should render an associated error message", async () => {
          expect(
            await within(
              image.parentElement?.parentElement as HTMLElement
            ).findByText(errorMessage)
          ).toBeTruthy();
        });
      }
    });
  };

  describe("when the card is NOT flipped", () => {
    beforeEach(() => {
      currentProps.currentlyFlipped = null;

      arrange();
    });

    checkImage({
      altText: `${_t(cardTranslations.frontAltText)}: ${baseProps.index + 1}`,
      imageSource: baseProps.imageFrontSrc,
      testId: testIDs.flipFrontImage,
    });

    checkImage({
      altText: `${_t(cardTranslations.rearAltText)}: ${baseProps.index + 1}`,
      imageSource: baseProps.imageRearSrc,
      testId: testIDs.flipRearImage,
    });

    describe("when an image is loaded", () => {
      beforeEach(() =>
        fireEvent.load(screen.getByTestId(testIDs.flipFrontImage))
      );

      it("should call the onLoad function as expected", () => {
        expect(mockOnLoad).toBeCalledTimes(1);
      });
    });

    describe("when an image load error occurs on the front", () => {
      beforeEach(() => {
        fireEvent.error(screen.getByTestId(testIDs.flipFrontImage));
      });

      checkImage({
        altText: `${_t(cardTranslations.frontAltText)}: ${baseProps.index + 1}`,
        errorMessage: baseProps.noArtWorkText,
        imageSource: baseProps.imageFrontFallBack,
        testId: testIDs.flipFrontText,
      });
    });

    describe("when the image is clicked", () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(testIDs.flipFrontImage));
      });

      it("should call the onClick function as flipCard", () => {
        expect(mockFlipCard).toBeCalledTimes(1);
        expect(mockFlipCard).toBeCalledWith(currentProps.index);
      });
    });
  });

  describe("when the card is flipped", () => {
    beforeEach(() => {
      currentProps.currentlyFlipped = currentProps.index;

      arrange();
    });

    checkImage({
      altText: `${_t(cardTranslations.frontAltText)}: ${baseProps.index + 1}`,
      imageSource: baseProps.imageFrontSrc,
      testId: testIDs.flipFrontImage,
    });

    checkImage({
      altText: `${_t(cardTranslations.rearAltText)}: ${baseProps.index + 1}`,
      imageSource: baseProps.imageRearSrc,
      testId: testIDs.flipRearImage,
    });

    describe("when an image is loaded", () => {
      beforeEach(() =>
        fireEvent.load(screen.getByTestId(testIDs.flipFrontImage))
      );

      it("should call the onLoad function as expected", () => {
        expect(mockOnLoad).toBeCalledTimes(1);
      });
    });

    describe("when an image load error occurs on the front", () => {
      beforeEach(() => {
        fireEvent.error(screen.getByTestId(testIDs.flipFrontImage));
      });

      checkImage({
        altText: `${_t(cardTranslations.frontAltText)}: ${baseProps.index + 1}`,
        errorMessage: baseProps.noArtWorkText,
        imageSource: baseProps.imageFrontFallBack,
        testId: testIDs.flipFrontText,
      });
    });

    describe("when the image is clicked", () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(testIDs.flipFrontImage));
      });

      it("should call the onClick function as flipCard", () => {
        expect(mockFlipCard).toBeCalledTimes(1);
        expect(mockFlipCard).toBeCalledWith(null);
      });
    });
  });
});
