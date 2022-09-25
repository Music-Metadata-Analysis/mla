import { Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import PrivacyHeader from "../privacy.header.component";
import dialogueSettings from "@src/config/dialogue";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Text"]);
});

describe("PrivacyHeader", () => {
  const mockT = new mockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<PrivacyHeader t={mockT} />);
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
