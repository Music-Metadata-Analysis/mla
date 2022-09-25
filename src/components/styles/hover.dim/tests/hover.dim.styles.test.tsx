import { Box } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import DimOnHover from "../hover.dim.styles";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box"]);
});

describe("DimOnHover", () => {
  const mockChildComponent = "mockChildComponent";
  let element: Element;

  beforeEach(async () => {
    arrange();
    element = await screen.findByText(mockChildComponent);
  });

  const arrange = () => {
    render(<DimOnHover>{mockChildComponent}</DimOnHover>);
  };

  it("should call Box with the correct props", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {}, 0, [], true);
  });

  it("should match the expected styles", async () => {
    expect(element).toHaveStyleRule("filter", "opacity(50%)", {
      target: "hover",
    });
  });
});
