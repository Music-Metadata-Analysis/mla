import { render, screen } from "@testing-library/react";
import SVSIcon from "../svs.icon";
import mainTranslations from "@locales/main.json";
import { _t } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/locale");

describe("Icons", () => {
  const arrange = (
    width: number | undefined = undefined,
    height: number | undefined = undefined
  ) => {
    render(<SVSIcon width={width} height={height} />);
  };

  describe("SVSIcon", () => {
    describe("when rendered with defaults", () => {
      beforeEach(() => arrange());

      it("should have the correct styles", async () => {
        const img = await screen.findByAltText(
          _t(mainTranslations.altText.svs)
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
          _t(mainTranslations.altText.svs)
        );
        expect(img).toHaveStyleRule("border-radius", "50%");
        expect(img).toHaveStyleRule("width", "100px");
        expect(img).toHaveStyleRule("height", "100px");
      });
    });
  });
});
