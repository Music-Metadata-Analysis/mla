import { Text } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/legal.json";
import dialogueSettings from "../../../../../config/dialogue";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../../tests/fixtures/mock.translation";
import PrivacyHeader from "../privacy.header.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Text"]);
});

describe("PrivacyHeader", () => {
  const mockT = jest.fn((key) => tLookup(key, translations));

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
