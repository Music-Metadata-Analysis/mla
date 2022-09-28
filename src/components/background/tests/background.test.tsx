import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import BackGround from "../background.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Box"]);
});

jest.mock("@src/hooks/colour", () => {
  return () => ({
    bodyColour: {
      background: MockColor,
    },
  });
});

const MockColor = "MockColor";

describe("Background", () => {
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
