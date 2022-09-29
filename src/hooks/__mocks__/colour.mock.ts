import type { Colour } from "@src/types/ui/chakra.types";

let colourIndex = 1;

function mockColour() {
  const colour = `mockColour${colourIndex}`;
  colourIndex++;
  return colour;
}

const mockValues = {
  bodyColour: {
    background: mockColour(),
  },
  buttonColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
    hoverBackground: mockColour(),
  },
  componentColour: {
    background: mockColour(),
    border: mockColour(),
    details: mockColour(),
    foreground: mockColour(),
    scheme: mockColour(),
  },
  consentColour: {
    accept: {
      background: mockColour(),
    },
    decline: {
      background: mockColour(),
    },
  },
  feedbackColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  flipCardColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
    textFront: mockColour(),
    textRear: mockColour(),
  },
  highlightColour: {
    background: mockColour(),
    foreground: mockColour(),
    border: mockColour(),
  },
  inputColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  modalColour: {
    background: mockColour(),
    border: mockColour(),
    foreground: mockColour(),
  },
  navButtonColour: {
    background: mockColour(),
    hoverBackground: mockColour(),
    selectedBackground: mockColour(),
  },
  sunBurstColour: {
    foreground: mockColour(),
  },
  transparent: mockColour(),
  utilities: {
    colourToCSS: jest.fn((colour: Colour) => `converted(${colour})`),
  },
};

export default mockValues;