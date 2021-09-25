import { Box, Img, Text } from "@chakra-ui/react";
import { render, screen, fireEvent } from "@testing-library/react";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import FlipCard, { FlipCardProps, testIDs } from "../flip.card.component";

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  const chakraMock = factoryInstance.create(["Box", "Img", "Center", "Text"]);
  return chakraMock;
});

const TestProps: FlipCardProps = {
  index: 1,
  currentlyFlipped: 0,
  size: 50,
  image: "/test/image.jpg",
  rearImage: "/test/rearImage.jpg",
  fallbackImage: "/test/fallbackImage.jpg",
  flipperController: jest.fn(),
  imageIsLoaded: jest.fn(),
  noArtWork: "No Cover Art Found",
  t: jest.fn((arg: string) => `t(${arg})`),
};

describe("FlipCard", () => {
  let currentProps: FlipCardProps;
  const borderSize = 1;

  const expectedBoxProps = {
    borderWidth: 1,
    borderColor: mockColourHook.flipCardColour.border,
    bg: mockColourHook.flipCardColour.background,
    color: mockColourHook.flipCardColour.foreground,
    width: TestProps.size,
    height: TestProps.size,
    cursor: "pointer",
    sx: {
      "&:hover": {
        opacity: 0.5,
      },
    },
  };

  beforeEach(() => {
    currentProps = { ...TestProps };
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<FlipCard {...currentProps} />);
  };

  describe("when loaded with a valid image", () => {
    describe("when NOT flipped", () => {
      beforeEach(() => {
        currentProps.index = 1;
        currentProps.currentlyFlipped = null;
        arrange();
      });

      it("should call Box twice with the correct props", () => {
        expect(Box).toBeCalledTimes(2);
        checkMockCall(Box, expectedBoxProps, 0);
        checkMockCall(Box, expectedBoxProps, 1);
      });

      it("should render the front image correctly", async () => {
        const image = await screen.findByTestId(testIDs.flipFrontImage);
        expect(image).toHaveAttribute("src", TestProps.image);
        expect(image).toHaveAttribute(
          "alt",
          `t(frontAltText): ${TestProps.index + 1}`
        );
        expect(image).toHaveAttribute("style", "position: relative;");
        expect(Img).toHaveBeenCalledTimes(2);

        const mockCall = (Img as jest.Mock).mock.calls[0][0];
        expect(mockCall.width).toBe(`${TestProps.size - borderSize * 2}px`);
        expect(mockCall.height).toBe(`${TestProps.size - borderSize * 2}px`);
        expect(typeof mockCall.onLoad).toBe("function");
        expect(typeof mockCall.onError).toBe("function");
      });

      it("should render the rear image correctly", async () => {
        const image = await screen.findByTestId(testIDs.flipRearImage);
        expect(image).toHaveAttribute("src", TestProps.rearImage);
        expect(image).toHaveAttribute(
          "alt",
          `t(rearAltText): ${TestProps.index + 1}`
        );
        expect(image).toHaveAttribute(
          "style",
          "position: relative; opacity: 0.5;"
        );
        expect(Img).toHaveBeenCalledTimes(2);

        const mockCall = (Img as jest.Mock).mock.calls[1][0];
        expect(mockCall.width).toBe(`${TestProps.size - borderSize * 2}px`);
        expect(mockCall.height).toBe(`${TestProps.size - borderSize * 2}px`);
        expect(typeof mockCall.onLoad).toBe("function");
      });

      it("should call Text once with the correct props", async () => {
        expect(Text).toBeCalledTimes(1);
        checkMockCall(Text, {
          color: mockColourHook.flipCardColour.textRear,
          "data-testid": testIDs.flipRearText,
          style: {
            position: "absolute",
          },
          fontSize: "3xl",
        });

        const text = await screen.findByTestId(testIDs.flipRearText);
        expect(text.innerHTML).toBe(`<strong>${TestProps.index + 1}</strong>`);
      });

      it("should call imageIsLoaded on the front image load", () => {
        fireEvent.load(screen.getByTestId(testIDs.flipFrontImage));
        expect(TestProps.imageIsLoaded).toBeCalledTimes(1);
      });

      it("should call imageIsLoaded on the rear image load", () => {
        fireEvent.load(screen.getByTestId(testIDs.flipRearImage));
        expect(TestProps.imageIsLoaded).toBeCalledTimes(1);
      });

      describe("when the front image is clicked", () => {
        beforeEach(() => {
          fireEvent.click(screen.getByTestId(testIDs.flipFrontImage));
        });

        it("should call the flipperController as expected", () => {
          expect(TestProps.flipperController).toBeCalledTimes(1);
          expect(TestProps.flipperController).toBeCalledWith(TestProps.index);
        });
      });
    });

    describe("when flipped", () => {
      beforeEach(() => {
        currentProps.index = 1;
        currentProps.currentlyFlipped = 1;
        arrange();
      });

      it("should call Box twice with the correct props", () => {
        expect(Box).toBeCalledTimes(2);
        checkMockCall(Box, expectedBoxProps, 0);
        checkMockCall(Box, expectedBoxProps, 1);
      });

      describe("when the rear image is clicked", () => {
        beforeEach(() => {
          fireEvent.click(screen.getByTestId(testIDs.flipRearImage));
        });

        it("should call the flipperController as expected", () => {
          expect(TestProps.flipperController).toBeCalledTimes(1);
          expect(TestProps.flipperController).toBeCalledWith(null);
        });
      });
    });
  });

  describe("when loaded with a invalid image", () => {
    beforeEach(() => {
      currentProps.index = 1;
      currentProps.currentlyFlipped = null;
      arrange();
      jest.clearAllMocks();
      fireEvent.error(screen.getByTestId(testIDs.flipFrontImage));
    });

    it("should render the front image correctly", async () => {
      const image = await screen.findByTestId(testIDs.flipFrontImage);
      expect(image).toHaveAttribute("src", TestProps.fallbackImage);
      expect(image).toHaveAttribute(
        "alt",
        `t(frontAltText): ${TestProps.index + 1}`
      );
      expect(image).toHaveAttribute("style", "position: relative;");
      expect(Img).toHaveBeenCalledTimes(2);

      const mockCall = (Img as jest.Mock).mock.calls[0][0];
      expect(mockCall.width).toBe(`${TestProps.size - borderSize * 2}px`);
      expect(mockCall.height).toBe(`${TestProps.size - borderSize * 2}px`);
      expect(typeof mockCall.onLoad).toBe("function");
      expect(typeof mockCall.onError).toBe("function");
    });

    it("should call Text twice, the first call has error props", async () => {
      expect(Text).toBeCalledTimes(2);
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.flipFrontText,
          color: mockColourHook.flipCardColour.textFront,
          style: {
            position: "absolute",
          },
          fontSize: "sm",
        },
        0
      );
      checkMockCall(
        Text,
        {
          "data-testid": testIDs.flipRearText,
          color: mockColourHook.flipCardColour.textRear,
          style: {
            position: "absolute",
          },
          fontSize: "3xl",
        },
        1
      );

      const text = await screen.findByTestId(testIDs.flipFrontText);
      expect(text.innerHTML).toBe(`<strong>${currentProps.noArtWork}</strong>`);
    });
  });
});
