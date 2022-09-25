import { render, screen } from "@testing-library/react";
import LastFMIcon from "../lastfm.icon";
import mainTranslations from "@locales/main.json";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

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
        const img = await screen.findByAltText(
          _t(mainTranslations.altText.lastfm)
        );
        expect(img).toHaveStyleRule("border-radius", "50%");
        expect(img).toHaveStyleRule("width", "50px");
        expect(img).toHaveStyleRule("height", "50px");
      });
    });

    describe("when rendered with values", () => {
      beforeEach(() => arrange(100, 100));

      it("should have the correct styles", async () => {
        const img = await screen.findByAltText(
          _t(mainTranslations.altText.lastfm)
        );
        expect(img).toHaveStyleRule("border-radius", "50%");
        expect(img).toHaveStyleRule("width", "100px");
        expect(img).toHaveStyleRule("height", "100px");
      });
    });
  });
});
