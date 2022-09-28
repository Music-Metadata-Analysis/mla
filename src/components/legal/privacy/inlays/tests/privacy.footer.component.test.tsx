import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import PrivacyFooter from "../privacy.footer.component";
import Button from "@src/components/button/button.external.link/button.external.link.component";
import dialogueSettings from "@src/config/dialogue";
import externalLinks from "@src/config/external";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock(
  "@src/components/button/button.external.link/button.external.link.component",
  () => {
    const { createComponent } = require("@fixtures/react");
    return createComponent("Button");
  }
);

jest.mock("@src/components/styles/hover.dim/hover.dim.styles", () =>
  require("@fixtures/react").createComponent("DimOnHover")
);

jest.mock("@src/components/icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Flex"]);
});

describe("PrivacyFooter", () => {
  const mockT = new mockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyFooter t={mockT} />);
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
