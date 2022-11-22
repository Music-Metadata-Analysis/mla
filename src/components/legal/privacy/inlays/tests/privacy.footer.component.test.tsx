import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import PrivacyFooter from "../privacy.footer.component";
import Button from "@src/components/button/button.external.link/button.external.link.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import mockUseRouter from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex"])
);
jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => require("@fixtures/react/parent").createComponent("Button")
);

jest.mock("@src/components/styles/hover.dim/hover.dim.styles", () =>
  require("@fixtures/react/parent").createComponent("DimOnHover")
);

jest.mock("@src/components/icons/svs/svs.icon", () =>
  require("@fixtures/react/child").createComponent("Icon")
);

describe("PrivacyFooter", () => {
  const mockT = new MockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyFooter router={mockUseRouter} t={mockT} />);
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
          href: externalLinks.privacyPolicy,
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
