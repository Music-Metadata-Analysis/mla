import { render, act, waitFor } from "@testing-library/react";
import FlipCard from "../flip.card.component";
import FlipCardContainer, {
  FlipCardContainerProps,
} from "../flip.card.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import useLocale from "@src/hooks/locale.hook";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@src/hooks/locale.hook");

jest.mock("../flip.card.component", () =>
  require("@fixtures/react/child").createComponent("FlipCard")
);

describe("FlipCardContainer", () => {
  let currentProps: FlipCardContainerProps;

  const mockFlipCard = jest.fn();
  const mockOnLoad = jest.fn();
  const mockT = new MockUseLocale("cards").t;

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

    jest.mocked(useLocale).mockReturnValueOnce({ t: mockT });
  };

  const checkFlipCardProps = ({
    call,
    expectedCallCount,
    expectedError,
    expectedImage,
  }: {
    call: number;
    expectedCallCount: number;
    expectedError: boolean;
    expectedImage: string;
  }) => {
    it("should call the FlipCard component with the correct props", async () => {
      await waitFor(() => expect(FlipCard).toBeCalledTimes(expectedCallCount));
      checkMockCall(
        FlipCard,
        {
          cardSize: currentProps.cardSize,
          currentlyFlipped: currentProps.currentlyFlipped,
          hasLoadError: expectedError,
          imageFrontActiveSrc: expectedImage,
          imageRearSrc: currentProps.imageRearSrc,
          index: currentProps.index,
          noArtWorkText: currentProps.noArtWorkText,
        },
        call,
        ["onClick", "onLoad", "onLoadError", "t"]
      );

      expect(jest.mocked(FlipCard).mock.calls[call][0].onLoad).toBe(
        currentProps.onLoad
      );
    });
  };

  describe("when the card is NOT flipped", () => {
    beforeEach(() => {
      currentProps.currentlyFlipped = null;

      arrange();
    });

    checkFlipCardProps({
      call: 0,
      expectedCallCount: 1,
      expectedError: false,
      expectedImage: baseProps.imageFrontSrc,
    });

    describe("when an error is triggered", () => {
      beforeEach(() => {
        const triggerError = jest.mocked(FlipCard).mock.calls[0][0].onLoadError;
        act(() => triggerError());
      });

      checkFlipCardProps({
        call: 1,
        expectedCallCount: 2,
        expectedError: true,
        expectedImage: baseProps.imageFrontFallBack,
      });
    });

    describe("when a click is triggered", () => {
      beforeEach(() => {
        const triggerClick = jest.mocked(FlipCard).mock.calls[0][0].onClick;
        act(() => triggerClick());
      });

      it(`should call the flipCard function with '1'`, () => {
        expect(mockFlipCard).toBeCalledTimes(1);
        expect(mockFlipCard).toBeCalledWith(currentProps.index);
      });
    });
  });

  describe("when the card is flipped", () => {
    beforeEach(() => {
      currentProps.currentlyFlipped = 1;

      arrange();
    });

    checkFlipCardProps({
      call: 0,
      expectedCallCount: 1,
      expectedError: false,
      expectedImage: baseProps.imageFrontSrc,
    });

    describe("when an error is triggered", () => {
      beforeEach(() => {
        const triggerError = jest.mocked(FlipCard).mock.calls[0][0].onLoadError;
        act(() => triggerError());
      });

      checkFlipCardProps({
        call: 1,
        expectedCallCount: 2,
        expectedError: true,
        expectedImage: baseProps.imageFrontFallBack,
      });
    });

    describe("when a click is triggered", () => {
      beforeEach(() => {
        const triggerClick = jest.mocked(FlipCard).mock.calls[0][0].onClick;
        act(() => triggerClick());
      });

      it("should call the flipCard function with 'null'", () => {
        expect(mockFlipCard).toBeCalledTimes(1);
        expect(mockFlipCard).toBeCalledWith(null);
      });
    });
  });
});
