import { render, screen, fireEvent } from "@testing-library/react";
import translation from "@locales/main.json";
import routes from "@src/config/routes";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import Custom404 from "@src/pages/404";
import mockRouter from "@src/tests/fixtures/mock.router";

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("next/router", () => ({
  useRouter: () => mockRouter,
}));

describe("404", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<Custom404 />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should display the correct error title", async () => {
      expect(
        await screen.findByText(_t(translation.errors[404].title))
      ).toBeTruthy();
    });

    it("should display the correct error message", async () => {
      expect(
        await screen.findByText(_t(translation.errors[404].message))
      ).toBeTruthy();
    });

    it("should display the correct button label", async () => {
      expect(
        await screen.findByText(_t(translation.errors[404].resetButton))
      ).toBeTruthy();
    });

    describe("when the reset button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByText(
          _t(translation.errors[404].resetButton)
        );
        fireEvent.click(link);
      });

      it("should route us back to home", () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(routes.home);
      });
    });
  });
});
