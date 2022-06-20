import { render } from "@testing-library/react";
import translations from "../../../../../public/locales/en/splash.json";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../tests/fixtures/mock.translation";
import Button from "../../../button/button.standard/button.standard.component";
import SplashFooter from "../splash.footer.component";

jest.mock("../../../button/button.standard/button.standard.component", () =>
  createMockedComponent("Button")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("SplashFooter", () => {
  const mockT = jest.fn((key: string) => tLookup(key, translations));

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
        analyticsName: "Splash Page Start",
        mb: 1,
        size: "xs",
      });
    });
  });
});
