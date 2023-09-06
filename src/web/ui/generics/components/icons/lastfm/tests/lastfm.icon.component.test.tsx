import { render, screen } from "@testing-library/react";
import LastFMIcon, { LastFMIconProps } from "../lastfm.icon.component";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

describe("LastFMIcon", () => {
  let currentProps: LastFMIconProps;

  const baseProps: LastFMIconProps = {
    altText: "mockAltText",
    height: 75,
    width: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<LastFMIcon {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkAltText = () => {
    it("should render the icon with the correct alternate text", async () => {
      await screen.findByAltText(currentProps.altText);
    });
  };

  const checkImageSource = () => {
    it("should render the icon with the correct image source", async () => {
      const img = await screen.findByAltText(currentProps.altText);
      // Default Image Provided By Jest Object Mapper
      expect(img).toHaveAttribute("src", "/public/images/lastfm.png");
    });
  };

  const checkStyle = () => {
    it("should render the icon with the correct styles", async () => {
      const img = await screen.findByAltText(currentProps.altText);
      expect(img).toHaveStyleRule("border-radius", "50%");
      expect(img).toHaveStyleRule("width", `${currentProps.width}px`);
      expect(img).toHaveStyleRule("height", `${currentProps.height}px`);
    });
  };

  describe("with a height of 75 and width of 50", () => {
    beforeEach(() => {
      currentProps.height = 75;
      currentProps.width = 50;

      arrange();
    });

    checkAltText();
    checkImageSource();
    checkStyle();
  });

  describe("with a height of 50 and width of 75", () => {
    beforeEach(() => {
      currentProps.height = 50;
      currentProps.width = 75;

      arrange();
    });

    checkAltText();
    checkImageSource();
    checkStyle();
  });
});
