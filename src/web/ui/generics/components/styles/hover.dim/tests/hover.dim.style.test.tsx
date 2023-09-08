import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import DimOnHover from "../hover.dim.style";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("DimOnHover", () => {
  const MockChildComponent = "MockChildComponent";
  let element: Element;

  beforeEach(async () => {
    arrange();
  });

  const arrange = () => {
    render(<DimOnHover>{MockChildComponent}</DimOnHover>);
  };

  it("should call Box with the correct props", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {}, 0, [], true);
  });

  it("should match the expected styles", async () => {
    element = await screen.findByText(MockChildComponent);
    expect(element).toHaveStyleRule("filter", "opacity(50%)", {
      target: "hover",
    });
  });
});
