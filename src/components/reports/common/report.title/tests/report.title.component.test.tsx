import { Box, Container, Text } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ReportTitle from "../report.title.component";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Box", "Container", "Text"]);
});

describe("ReportTitle", () => {
  const testProps = {
    title: "MockTitle",
    userName: "niall-Byrne",
    size: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    arrange();
  });

  const arrange = () => {
    return render(<ReportTitle {...testProps} />);
  };

  it("should call Box with the correct props", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      bg: mockColourHook.componentColour.background,
      color: mockColourHook.componentColour.foreground,
      mb: "5px",
      ml: "5px",
      mr: "5px",
      mt: "45px",
      p: 3,
      w: "100%",
    });
  });

  it("should call Container with the correct props", () => {
    expect(Container).toBeCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
      maxW: `${4 * testProps.size + 20}px`,

      sx: {
        caretColor: mockColourHook.transparent,
      },
      textAlign: "center",
    });
  });

  it("should call Text with the correct props", () => {
    expect(Text).toBeCalledTimes(2);
    checkMockCall(
      Text,
      {
        fontSize: ["xl", "2xl", "3xl"],
      },
      0
    );
    checkMockCall(
      Text,
      {
        fontSize: ["l", "xl", "2xl"],
      },
      1
    );
  });

  it("should render the username", async () => {
    expect(await screen.findByText(testProps.userName as string)).toBeTruthy();
  });

  it("should render the title", async () => {
    expect(await screen.findByText(testProps.title)).toBeTruthy();
  });
});
