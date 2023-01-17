import { Box } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import mockControllerHook from "../../controllers/__mocks__/navbar.layout.controller.hook.mock";
import NavBarMobileMenu from "../navbar.mobile.menu.component";
import { testIDs } from "../navbar.mobile.menu.identifiers";
import NavBarOptions from "@src/components/navbar/options/navbar.options.component";
import navConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.hook.mock";

jest.mock("@src/components/navbar/options/navbar.options.component", () =>
  require("@fixtures/react/parent").createComponent("NavBarOptions")
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("NavBarMobileMenu", () => {
  let mockTransaction: boolean;

  const mockConfig = navConfig.menuConfig;
  const mockedNavBarComponents = {
    NavBarOptions: "NavBarOptions",
  };

  const mockNavBarT = new MockUseLocale("navbar").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarMobileMenu
        analytics={{ trackButtonClick: mockAnalyticsHook.trackButtonClick }}
        config={mockConfig}
        controls={mockControllerHook.controls}
        navBarT={mockNavBarT}
        transaction={mockTransaction}
        router={{ path: mockRouterHook.path }}
      />
    );
  };

  const checkNotRendered = () => {
    it("should NOT render the mobile menu", () => {
      expect(Box).toBeCalledTimes(0);
      expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
    });
  };

  const checkRendered = () => {
    it("should render the mobile menu Chakra Box component with the expected props", () => {
      expect(Box).toBeCalledTimes(1);
      checkMockCall(
        Box,
        {
          "data-testid": testIDs.NavBarMobileMenu,
          pb: 4,
          display: { sm: "none" },
        },
        0
      );
    });

    it("should ALSO render the mobile menu NavBarOptions component inside the mobile menu Box component", async () => {
      expect(NavBarOptions).toBeCalledTimes(1);
      const menu = await screen.findByTestId(testIDs.NavBarMobileMenu);
      within(menu).findByTestId(mockedNavBarComponents.NavBarOptions);
      checkMockCall(
        NavBarOptions,
        {
          closeMobileMenu: mockControllerHook.controls.mobileMenu.setFalse,
          config: mockConfig,
          currentPath: mockRouterHook.path,
          navBarT: mockNavBarT,
          transaction: mockTransaction,
          tracker: mockAnalyticsHook.trackButtonClick,
        },
        0
      );
    });
  };

  describe("when there is a transaction in progress", () => {
    beforeEach(() => (mockTransaction = true));

    describe("when the mobile menu is open", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when the mobile menu is closed", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });

  describe("when there is NOT a transaction in progress", () => {
    beforeEach(() => (mockTransaction = false));

    describe("when the mobile menu is open", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = true;

        arrange();
      });

      checkRendered();
    });

    describe("when the mobile menu is closed", () => {
      beforeEach(() => {
        mockControllerHook.controls.mobileMenu.state = false;

        arrange();
      });

      checkNotRendered();
    });
  });
});
