import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
// @ts-ignore: mocked with forwardRef
import { BoxWithRef, Flex, IconButton } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
import NavBarRoot from "../navbar.root.component";
import { testIDs } from "../navbar.root.identifiers";
import navConfig from "@src/config/navbar";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/fixtures/mocks/mock.component.props";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.hook.mock";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import NavBarColourModeContainer from "@src/web/navigation/navbar/components/colour.mode/navbar.colour.mode.container";
import NavBarLogo from "@src/web/navigation/navbar/components/logo/navbar.logo.component";
import NavBarMobileMenu from "@src/web/navigation/navbar/components/mobile.menu/navbar.mobile.menu.component";
import NavBarOptions from "@src/web/navigation/navbar/components/options/navbar.options.component";
import NavBarSessionControlContainer from "@src/web/navigation/navbar/components/session.control/navbar.session.control.container";
import NavBarSpinner from "@src/web/navigation/navbar/components/spinner/navbar.spinner.component";
import mockNavBarLayoutControllerHook from "@src/web/navigation/navbar/state/controllers/__mocks__/navbar.layout.controller.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock(
  "@src/web/navigation/navbar/components/colour.mode/navbar.colour.mode.container",
  () =>
    require("@fixtures/react/parent").createComponent(
      "NavBarColourModeContainer"
    )
);

jest.mock(
  "@src/web/navigation/navbar/components/logo/navbar.logo.component",
  () => require("@fixtures/react/parent").createComponent("NavBarLogo")
);

jest.mock(
  "@src/web/navigation/navbar/components/mobile.menu/navbar.mobile.menu.component",
  () => require("@fixtures/react/child").createComponent("NavBarMobileMenu")
);

jest.mock(
  "@src/web/navigation/navbar/components/options/navbar.options.component",
  () => require("@fixtures/react/parent").createComponent("NavBarOptions")
);

jest.mock(
  "@src/web/navigation/navbar/components/session.control/navbar.session.control.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "NavBarSessionControlContainer"
    )
);

jest.mock(
  "@src/web/navigation/navbar/components/spinner/navbar.spinner.component",
  () => require("@fixtures/react/parent").createComponent("NavBarSpinner")
);

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock([
    "CloseIcon",
    "HamburgerIcon",
  ])
);

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Flex", "IconButton"], ["Box"])
);

describe("NavBar", () => {
  let mockTransaction: boolean;

  const mockConfig = navConfig.menuConfig;
  const mockedComponents = {
    NavBarColourModeContainer: "NavBarColourModeContainer",
    NavBarLogo: "NavBarLogo",
    NavBarMobileMenu: "NavBarMobileMenu",
    NavBarOptions: "NavBarOptions",
    NavBarSessionControlContainer: "NavBarSessionControlContainer",
    NavBarSpinner: "NavBarSpinner",
  };

  const mockUserAuth = {
    name: "mockUserName",
    image: "https://mock/image.png",
  };

  const mockNavBarT = new MockUseLocale("navbar").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarRoot
        analytics={{ trackButtonClick: mockAnalyticsHook.trackButtonClick }}
        config={mockConfig}
        controls={mockNavBarLayoutControllerHook.controls}
        navBarT={mockNavBarT}
        transaction={mockTransaction}
        rootReference={mockNavBarLayoutControllerHook.rootReference}
        router={{ path: mockRouterHook.path }}
        user={mockUserAuth}
      />
    );
  };

  const checkProp = (
    args: { component: typeof IconButton; call: number },
    propName: string,
    result: unknown
  ) => {
    expect(getMockComponentProp({ ...args, propName })).toStrictEqual(result);
  };

  const checkChakraBoxComponent = () => {
    it("should render the Chakra Box component with the expected props", () => {
      expect(jest.mocked(BoxWithRef).mock.calls.length).toBeGreaterThan(0);
      checkMockCall(BoxWithRef, {
        bg: mockColourHook.componentColour.background,
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        borderColor: mockColourHook.componentColour.border,
        color: mockColourHook.componentColour.foreground,
        "data-testid": "NavBarRoot",
        fontSize: [18, 18, 20],
        px: [2, 2, 2, 4],
        style: {
          position: "fixed",
          top: 0,
          width: "100%",
        },
        sx: {
          caretColor: mockColourHook.transparent,
        },
        zIndex: 1000,
      });
    });
  };

  const checkChakraFlexComponent = () => {
    it("should render the Chakra Flex component with the correct props", async () => {
      expect(Flex).toBeCalledTimes(4);
      checkMockCall(
        Flex,
        {
          alignItems: "center",
          h: 16,
          justifyContent: "space-between",
        },
        0
      );
      checkMockCall(
        Flex,
        {
          "data-testid": testIDs.NavBarMenu,
          alignItems: "center",
          h: 16,
          justifyContent: "flex-end",
        },
        1
      );
      checkMockCall(
        Flex,
        {
          alignItems: "center",
        },
        2
      );
      checkMockCall(
        Flex,
        {
          as: "nav",
          display: { base: "none", sm: "flex" },
        },
        3
      );
    });

    it("should render the NavBarMenu Flex component, inside the NavSpinner component", async () => {
      const spinner = await screen.findByTestId(mockedComponents.NavBarSpinner);
      within(spinner).findByTestId(testIDs.NavBarMenu);
    });
  };

  const checkChakraIconButtonComponent = ({ isOpen }: { isOpen: boolean }) => {
    it("should render the Menu Hamburger Button with the right props", () => {
      expect(IconButton).toBeCalledTimes(1);
      const iconRender = { component: IconButton, call: 0 };

      expect(getMockComponentPropCount(iconRender)).toBe(8);
      checkProp(iconRender, "aria-label", "Open Menu");
      checkProp(iconRender, "data-testid", testIDs.NavBarMobileMenuButton);
      checkProp(
        iconRender,
        "disabled",
        !mockNavBarLayoutControllerHook.controls.hamburger.state
      );
      checkProp(iconRender, "display", { sm: "none" });
      checkProp(iconRender, "ml", [0, 0, 1]);
      checkProp(iconRender, "size", "md");

      expect(
        typeof getMockComponentProp({ ...iconRender, propName: "onClick" })
      ).toBe("function");

      if (isOpen) {
        expect(
          ReactDOMServer.renderToString(
            getMockComponentProp({ ...iconRender, propName: "icon" })
          )
        ).toBe(ReactDOMServer.renderToString(<CloseIcon />));
      } else {
        expect(
          ReactDOMServer.renderToString(
            getMockComponentProp({ ...iconRender, propName: "icon" })
          )
        ).toBe(ReactDOMServer.renderToString(<HamburgerIcon />));
      }
    });
  };

  const checkLogoComponent = () => {
    it("should render the NavBarLogo component with the expected props", async () => {
      expect(NavBarLogo).toBeCalledTimes(1);
      checkMockCall(NavBarLogo, {
        closeMobileMenu:
          mockNavBarLayoutControllerHook.controls.mobileMenu.setFalse,
        currentPath: mockRouterHook.path,
        navBarT: mockNavBarT,
        transaction: mockTransaction,
        tracker: mockAnalyticsHook.trackButtonClick,
        user: mockUserAuth,
      });
    });
  };

  const checkSpinnerComponent = () => {
    it("should render the NavBarSpinner component with the expected props", async () => {
      expect(NavBarSpinner).toBeCalledTimes(1);
      checkMockCall(NavBarSpinner, { whileTrue: mockTransaction }, 0);
    });
  };

  const checkColourModeContainer = () => {
    it("should render the NavBarColourModeContainer component with the expected props", () => {
      expect(NavBarColourModeContainer).toBeCalledTimes(1);
      checkMockCall(
        NavBarColourModeContainer,
        {
          tracker: mockAnalyticsHook.trackButtonClick,
        },
        0
      );
    });
  };

  const checkSessionControllerContainer = () => {
    it("should render the NavBarSessionControlContainer component with the expected props", () => {
      expect(NavBarSessionControlContainer).toBeCalledTimes(1);
      checkMockCall(
        NavBarSessionControlContainer,
        {
          closeMobileMenu:
            mockNavBarLayoutControllerHook.controls.mobileMenu.setFalse,
        },
        0
      );
    });
  };

  const checkNavBarOptionsComponent = () => {
    it("should render the NavBarOptions component inside the menu Flex component", async () => {
      expect(NavBarOptions).toBeCalledTimes(1);
      const menu = await screen.findByTestId(testIDs.NavBarMenu);
      within(menu).findByTestId(mockedComponents.NavBarOptions);
      checkMockCall(
        NavBarOptions,
        {
          closeMobileMenu:
            mockNavBarLayoutControllerHook.controls.mobileMenu.setFalse,
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

  const checkNavBarMobileMenuComponent = () => {
    it("should render the NavBarOptions component inside the menu Flex component", async () => {
      expect(NavBarMobileMenu).toBeCalledTimes(1);
      checkMockCall(
        NavBarMobileMenu,
        {
          analytics: { trackButtonClick: mockAnalyticsHook.trackButtonClick },
          config: mockConfig,
          controls: mockNavBarLayoutControllerHook.controls,
          navBarT: mockNavBarT,
          transaction: mockTransaction,
          router: { path: mockRouterHook.path },
        },
        0
      );
    });
  };

  const scenarioOne = () => {
    describe("when the menu is closed", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.mobileMenu.state = false;

        arrange();
      });

      checkChakraBoxComponent();
      checkChakraFlexComponent();
      checkChakraIconButtonComponent({ isOpen: false });
      checkLogoComponent();
      checkSpinnerComponent();
      checkColourModeContainer();
      checkSessionControllerContainer();
      checkNavBarOptionsComponent();
      checkNavBarMobileMenuComponent();
    });
  };

  const scenarioTwo = () => {
    describe("when the menu is open", () => {
      beforeEach(() => {
        mockNavBarLayoutControllerHook.controls.mobileMenu.state = true;

        arrange();
      });

      checkChakraBoxComponent();
      checkChakraFlexComponent();
      checkChakraIconButtonComponent({ isOpen: true });
      checkLogoComponent();
      checkSpinnerComponent();
      checkColourModeContainer();
      checkSessionControllerContainer();
      checkNavBarOptionsComponent();
      checkNavBarMobileMenuComponent();
    });
  };

  describe("when there is a transaction in progress", () => {
    beforeEach(() => (mockTransaction = true));

    scenarioOne();
    scenarioTwo();
  });

  describe("when there is NOT a transaction in progress", () => {
    beforeEach(() => (mockTransaction = false));

    scenarioOne();
    scenarioTwo();
  });
});
