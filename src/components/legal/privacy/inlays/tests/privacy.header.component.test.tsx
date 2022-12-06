import { Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import PrivacyHeader from "../privacy.header.component";
import dialogueSettings from "@src/config/dialogue";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockUseRouter from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Text"])
);

describe("PrivacyHeader", () => {
  const mockT = new MockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyHeader router={mockUseRouter} t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Text with the correct props", () => {
      expect(Text).toBeCalledTimes(1);
      checkMockCall(
        Text,
        {
          fontSize: dialogueSettings.smallTextFontSize,
          mb: 8,
          textAlign: "center",
        },
        0
      );
    });
  });
});
