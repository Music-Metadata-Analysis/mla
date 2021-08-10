import { render, screen, fireEvent } from "@testing-library/react";
import translation from "../../public/locales/en/main.json";
import routes from "../config/routes";
import Custom404 from "../pages/404";
import mockRouter from "../tests/fixtures/mock.router";

jest.mock("next/router", () => ({
  __esModule: true,
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
        await screen.findByText(translation.errors[404].title)
      ).toBeTruthy();
    });

    it("should display the correct error message", async () => {
      expect(
        await screen.findByText(translation.errors[404].message)
      ).toBeTruthy();
    });

    it("should display the correct button label", async () => {
      expect(
        await screen.findByText(translation.errors[404].resetButton)
      ).toBeTruthy();
    });

    describe("when the reset button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByText(
          translation.errors[404].resetButton
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
