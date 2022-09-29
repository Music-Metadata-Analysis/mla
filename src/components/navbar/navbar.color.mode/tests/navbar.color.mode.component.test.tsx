import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch, useColorMode } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import NavBarColorModeToggle, { TestIDs } from "../navbar.color.mode.component";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/analytics");

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock([
    "MoonIcon",
    "SunIcon",
  ])
);

jest.mock("@chakra-ui/react", () => {
  const mockModule = require("@fixtures/chakra").createChakraMock(["Switch"]);
  mockModule.useColorMode = jest.fn();
  return mockModule;
});

const mockToggleColorMode = jest.fn();

describe("NavBarColorModeToggle", () => {
  let mockColorMode: "light" | "dark" = "light" as const;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    return render(<NavBarColorModeToggle />);
  };

  const checkSwitch = ({ isChecked }: { isChecked: boolean }) => {
    it("should render the Switch", () => {
      expect(Switch).toBeCalledTimes(1);
      checkMockCall(
        Switch,
        {
          colorScheme: "yellow",
          "data-testid": "ColorModeToggle",
          isChecked: isChecked,
          ml: [1, 2, 3],
          mr: [0, 1, 2],
        },
        0,
        ["onChange"]
      );
    });
  };

  describe("when color mode is light", () => {
    beforeEach(() => {
      mockColorMode = "light";
      (useColorMode as jest.Mock).mockImplementationOnce(() => ({
        toggleColorMode: mockToggleColorMode,
        colorMode: mockColorMode,
      }));
      arrange();
    });

    it("should render the SunIcon", () => {
      expect(SunIcon).toBeCalledTimes(1);
      checkMockCall(SunIcon, { color: "yellow.500", w: 5, h: 5 });
    });

    it("should NOT render the MoonIcon", () => {
      expect(MoonIcon).toBeCalledTimes(0);
    });

    checkSwitch({ isChecked: true });

    describe("when clicked", () => {
      beforeEach(async () => {
        expect(mockToggleColorMode).toBeCalledTimes(0);
        const toggle = await screen.findByTestId(TestIDs.ColorModeToggle);
        fireEvent.click(toggle);
      });

      it("should call the mockToggleColorMode function once", () => {
        expect(mockToggleColorMode).toBeCalledTimes(1);
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe("Colour Mode Toggle");
        expect(Object.keys(call).length).toBe(2);
      });
    });
  });

  describe("when color mode is dark", () => {
    beforeEach(() => {
      mockColorMode = "dark";
      (useColorMode as jest.Mock).mockImplementationOnce(() => ({
        toggleColorMode: mockToggleColorMode,
        colorMode: mockColorMode,
      }));
      arrange();
    });

    it("should render the MoonIcon", () => {
      expect(MoonIcon).toBeCalledTimes(1);
      checkMockCall(MoonIcon, { w: 5, h: 5 });
    });

    it("should render the SunIcon", () => {
      expect(SunIcon).toBeCalledTimes(0);
    });

    checkSwitch({ isChecked: false });

    describe("when clicked", () => {
      beforeEach(async () => {
        expect(mockToggleColorMode).toBeCalledTimes(0);
        const toggle = await screen.findByTestId(TestIDs.ColorModeToggle);
        fireEvent.click(toggle);
      });

      it("should call the mockToggleColorMode function once", () => {
        expect(mockToggleColorMode).toBeCalledTimes(1);
      });

      it("should generate an analytics event", () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe("Colour Mode Toggle");
        expect(Object.keys(call).length).toBe(2);
      });
    });
  });
});
