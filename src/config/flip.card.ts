const cardSize = 100;

const settings = {
  cardSize,
  flipCardImageSize: "large" as const,
  maxWidth: 4 * cardSize + 20,
  drawer: {
    imageSize: "150",
    lastFMImageSize: "large" as const,
  },
};

export default settings;
