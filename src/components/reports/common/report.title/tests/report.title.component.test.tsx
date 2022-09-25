import { Box, Container, Text } from "@chakra-ui/react";
import { render, screen } from "@testing-library/react";
import ReportTitle from "../report.title.component";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.react.factory.class");
  return factoryInstance.create(["Box", "Container", "Text"]);
});

jest.mock("@src/hooks/colour", () => () => mockColourHook);

describe("ReportTitle", () => {
  const testProps = {
    title: "MockTitle",
    userName: "niall-Byrne" as string | null,
    size: 100,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<ReportTitle {...testProps} />);
  };

  describe("when username is defined", () => {
    beforeEach(() => {
      testProps.userName = "niall-byrne";
      arrange();
    });

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
        textAlign: "center",
        sx: {
          caretColor: mockColourHook.transparent,
        },
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
      expect(
        await screen.findByText(testProps.userName as string)
      ).toBeTruthy();
    });

    it("should render the title", async () => {
      expect(await screen.findByText(testProps.title)).toBeTruthy();
    });
  });

  describe("when username is NOT defined", () => {
    beforeEach(() => {
      testProps.userName = null;
      arrange();
    });

    it("should NOT call Box", () => {
      expect(Box).toBeCalledTimes(0);
    });

    it("should NOT call Container", () => {
      expect(Container).toBeCalledTimes(0);
    });

    it("should NOT call Text", () => {
      expect(Text).toBeCalledTimes(0);
    });

    it("should NOT render the title", () => {
      expect(screen.queryByText(testProps.title)).toBeNull();
    });
  });
});
