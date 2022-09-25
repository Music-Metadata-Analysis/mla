import { render } from "@testing-library/react";
import SplashFooter from "../splash.footer.component";
import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => createMockedComponent("Button")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SplashFooter", () => {
  const mockT = new mockUseLocale("splash").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<SplashFooter t={mockT} />);
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
