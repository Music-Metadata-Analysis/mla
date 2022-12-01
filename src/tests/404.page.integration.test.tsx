import { render, screen, fireEvent } from "@testing-library/react";
import translation from "@locales/errors.json";
import { mockIsBuildTime } from "@src/clients/web.framework/__mocks__/vendor.mock";
import routes from "@src/config/routes";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import Custom404 from "@src/pages/404";

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/router");

jest.mock("@src/clients/web.framework/vendor");

describe("404", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<Custom404 />);
  };

  describe("when rendered at run time", () => {
    beforeEach(() => {
      mockIsBuildTime.mockReturnValue(false);

      arrange();
    });

    it("should display the correct error title", async () => {
      expect(
        await screen.findByText(_t(translation["404"].title))
      ).toBeTruthy();
    });

    it("should display the correct error message", async () => {
      expect(
        await screen.findByText(_t(translation["404"].message))
      ).toBeTruthy();
    });

    it("should display the correct button label", async () => {
      expect(
        await screen.findByText(_t(translation["404"].resetButton))
      ).toBeTruthy();
    });

    describe("when the reset button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByText(
          _t(translation["404"].resetButton)
        );
        fireEvent.click(link);
      });

      it("should route us back to home", () => {
        expect(mockRouterHook.push).toBeCalledTimes(1);
        expect(mockRouterHook.push).toBeCalledWith(routes.home);
      });
    });
  });
});
