import { Container } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import TermsOfServiceHeader from "../terms.header.component";
import dialogueSettings from "@src/config/dialogue";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Container"])
);

describe("TermsOfServiceHeader", () => {
  const mockT = new MockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceHeader router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(2);
      checkMockCall(
        Container,
        {
          centerContent: true,
          mb: 3,
          fontSize: dialogueSettings.smallTextFontSize,
        },
        0
      );
      checkMockCall(
        Container,
        {
          centerContent: true,
          mb: 3,
          fontSize: dialogueSettings.smallTextFontSize,
        },
        1
      );
    });
  });
});
