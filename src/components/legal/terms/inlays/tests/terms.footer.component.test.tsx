import { Flex } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/legal.json";
import externalLinks from "../../../../../config/external";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../../tests/fixtures/mock.translation";
import Button from "../../../../button/button.external.link/button.external.link.component";
import TermsOfServiceFooter from "../terms.footer.component";

jest.mock(
  "../../../../button/button.external.link/button.external.link.component",
  () => createMockedComponent("Button")
);

jest.mock(
  "../../../../clickable/click.external.link/click.external.link.component",
  () => createMockedComponent("ClickLink")
);

jest.mock("../../../../styles/hover.dim/hover.dim.styles", () =>
  createMockedComponent("DimOnHover")
);

jest.mock("../../../../icons/svs/svs.icon", () =>
  jest.fn(() => <div>MockIcon</div>)
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Flex"]);
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("TermsOfServiceFooter", () => {
  const mockT = jest.fn((key) => tLookup(key, translations));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceFooter t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Button with the correct props", () => {
      expect(Button).toBeCalledTimes(2);
      checkMockCall(
        Button,
        {
          href: externalLinks.svsContact,
          mb: 2,
          mr: 2,
          w: "125px",
        },
        0
      );
      checkMockCall(
        Button,
        {
          href: externalLinks.termsOfService,
          mb: 2,
          ml: 2,
          w: "125px",
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
