import { Container } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import translations from "../../../../../../public/locales/en/legal.json";
import checkMockCall from "../../../../../tests/fixtures/mock.component.call";
import tLookup from "../../../../../tests/fixtures/mock.translation";
import PrivacyHeader from "../privacy.header.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Container"]);
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

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(
        Container,
        {
          centerContent: true,
          mb: 8,
          fontSize: [12, 14, 14, "md"],
        },
        0
      );
    });
  });
});
