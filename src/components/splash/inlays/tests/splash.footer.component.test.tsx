import { render } from "@testing-library/react";
import SplashFooter from "../splash.footer.component";
import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

describe("SplashFooter", () => {
  const mockT = new MockUseLocale("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashFooter router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(1);
      checkMockCall(Button, {
        ...dialogueSettings.buttonComponentProps,
        analyticsName: "Splash Page Start",
      });
    });
  });
});
