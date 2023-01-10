import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ChakraMainBackGround from "../background.component";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockVendorColourHook from "@src/vendors/integrations/ui.framework/__mocks__/vendor.colour.hook.mock";

jest.mock("@src/vendors/integrations/ui.framework/vendor");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("ChakraMainBackGround", () => {
  const mockChildComponent = "MockChildComponent";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(
      <ChakraMainBackGround>
        <div>{mockChildComponent}</div>
      </ChakraMainBackGround>
    );
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Box with the correct props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(Box, {
        bg: mockVendorColourHook.bodyColour.background,
        minHeight: "100vh",
        minWidth: "100%",
      });
    });

    it("should return the mock child component", async () => {
      expect(await screen.findByText(mockChildComponent)).toBeTruthy();
    });
  });
});
