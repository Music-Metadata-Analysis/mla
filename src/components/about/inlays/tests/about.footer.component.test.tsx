import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import Footer from "../about.footer.component";
import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => createMockedComponent("Button")
);

jest.mock("@src/components/icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("About", () => {
  const mockT = new mockUseLocale("about").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Footer t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {}, 0);
    });

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(2);
      checkMockCall(
        Button,
        {
          ...dialogueSettings.buttonComponentProps,
          analyticsName: "About Page Privacy Policy",
          w: dialogueSettings.buttonPairSizes,
        },
        0
      );
      checkMockCall(
        Button,
        {
          ...dialogueSettings.buttonComponentProps,
          analyticsName: "About Page Start",
          w: dialogueSettings.buttonPairSizes,
        },
        1
      );
    });
  });
});
