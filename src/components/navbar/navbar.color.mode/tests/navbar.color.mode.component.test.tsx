import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch, useColorMode } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock.hook";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import NavBarColorModeToggle, { TestIDs } from "../navbar.color.mode.component";

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.react.factory.class");
  const instance = factoryInstance.create(["Switch"]);
  instance.useColorMode = jest.fn();
  return instance;
});

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.icon.factory.class");
  const instance = factoryInstance.create(["MoonIcon", "SunIcon"]);
  instance.useColorMode = jest.fn();
  return instance;
});

let mockColorMode: "light" | "dark" = "light" as const;
const mockToggleColorMode = jest.fn();

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

describe("NavBarColorModeToggle", () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    return render(<NavBarColorModeToggle />);
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
