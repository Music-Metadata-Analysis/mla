import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import BackGround from "../background.component";

// todo: refactor to use mock colour hook

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box"]);
});

jest.mock("../../../hooks/colour", () => {
  return () => ({
    bodyColour: {
      background: MockColor,
    },
  });
});

const MockColor = "MockColor";

describe("background", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <BackGround>
        <div>{mockChildComponent}</div>
      </BackGround>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {
        bg: MockColor,
        minHeight: "100vh",
        minWidth: "100%",
      });
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
