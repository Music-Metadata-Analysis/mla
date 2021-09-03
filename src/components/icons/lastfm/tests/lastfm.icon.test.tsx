import { render, screen } from "@testing-library/react";
import mainTranslations from "../../../../../public/locales/en/main.json";
import LastFMIcon from "../lastfm.icon";

describe("Icons", () => {
  const arrange = (
    width: number | undefined = undefined,
    height: number | undefined = undefined
  ) => {
    render(<LastFMIcon width={width} height={height} />);
  };

  describe("LastFMIcon", () => {
    describe("when rendered with defaults", () => {
      beforeEach(() => arrange());

      it("should have the correct styles", async () => {
        const img = await screen.findByAltText(mainTranslations.altText.lastfm);
        expect(img).toHaveStyleRule("border-radius", "50%");
        expect(img).toHaveStyleRule("width", "50px");
        expect(img).toHaveStyleRule("height", "50px");
      });
    });

    describe("when rendered with values", () => {
      beforeEach(() => arrange(100, 100));

      it("should have the correct styles", async () => {
        const img = await screen.findByAltText(mainTranslations.altText.lastfm);
        expect(img).toHaveStyleRule("border-radius", "50%");
        expect(img).toHaveStyleRule("width", "100px");
        expect(img).toHaveStyleRule("height", "100px");
      });
    });
  });
});
