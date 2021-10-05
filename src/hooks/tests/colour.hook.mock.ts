let colourIndex = 1;

function mockColour() {
  const colour = `mockColour${colourIndex}`;
  colourIndex++;
  return colour;
}

const mockColourHook = {
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
  navButtonColour: {
    background: mockColour(),
    hoverBackground: mockColour(),
    selectedBackground: mockColour(),
  },
  transparent: mockColour(),
};

export default mockColourHook;
