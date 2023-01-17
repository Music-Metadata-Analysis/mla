import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Switch } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import NavBarColorModeToggle from "../navbar.colour.mode.component";
import { testIDs } from "../navbar.colour.mode.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import type { UIVendorColourModeType } from "@src/vendors/types/integrations/ui.framework/vendor.types";

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock([
    "MoonIcon",
    "SunIcon",
  ])
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Switch"])
);

describe("NavBarColorModeToggle", () => {
  let mockColourMode: UIVendorColourModeType;

  const mockHandleChange = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    return render(
      <NavBarColorModeToggle
        colourMode={mockColourMode}
        handleChange={mockHandleChange}
      />
    );
  };

  const checkSwitch = ({ isChecked }: { isChecked: boolean }) => {
    it("should render the Switch", () => {
      expect(Switch).toBeCalledTimes(1);

      const call = jest.mocked(Switch).mock.calls[0][0];

      expect(call.colorScheme).toBe("yellow");
      expect(call["data-testid"]).toBe(testIDs.ColorModeToggle);
      expect(call.isChecked).toBe(isChecked);
      expect(call.ml).toStrictEqual([1, 2, 3]);
      expect(call.mr).toStrictEqual([0, 0.5, 0.5]);
      expect(call.onChange).toBe(mockHandleChange);

      expect(Object.keys(call).length).toBe(6);
    });
  };

  describe("when color mode is light", () => {
    beforeEach(() => {
      mockColourMode = "light";

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
  });

  describe("when color mode is dark", () => {
    beforeEach(() => {
      mockColourMode = "dark";

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
  });
});
