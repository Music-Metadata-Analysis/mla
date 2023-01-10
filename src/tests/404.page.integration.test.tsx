import { render, screen, fireEvent } from "@testing-library/react";
import translation from "@locales/errors.json";
import routes from "@src/config/routes";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.hook.mock";
import Custom404 from "@src/pages/404";
import { mockIsBuildTime } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/hooks/router.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor");

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
