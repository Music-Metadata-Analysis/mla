import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import TermsOfServiceFooter from "../terms.footer.component";
import Button from "@src/components/button/button.external.link/button.external.link.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);

jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

describe("TermsOfServiceFooter", () => {
  const mockT = new MockUseTranslation("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceFooter router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(2);
      checkMockCall(
        Button,
        {
          ...dialogueSettings.buttonComponentProps,
          href: externalLinks.svsContact,
          w: dialogueSettings.buttonPairSizes,
        },
        0
      );
      checkMockCall(
        Button,
        {
          ...dialogueSettings.buttonComponentProps,
          href: externalLinks.termsOfService,
          w: dialogueSettings.buttonPairSizes,
        },
        1
      );
    });

    it("should call Flex with the correct props", () => {
      expect(Flex).toBeCalledTimes(1);
      checkMockCall(Flex, {}, 0);
    });
  });
});
