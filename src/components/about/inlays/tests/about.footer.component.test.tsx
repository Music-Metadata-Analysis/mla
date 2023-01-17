import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import Footer from "../about.footer.component";
import Button from "@src/components/button/button.standard/button.standard.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

jest.mock(
  "@src/components/button/button.standard/button.standard.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

describe("About", () => {
  const mockT = new MockUseLocale("about").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<Footer router={mockUseRouter} t={mockT} />);
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
