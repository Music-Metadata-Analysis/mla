import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
// @ts-ignore: mocked with forwardRef
import { BoxWithRef, Flex, IconButton } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
import NavBarColourModeContainer from "../../navbar.colour.mode/navbar.colour.mode.container";
import mockControllerHook from "../../navbar.hooks/__mocks__/navbar.ui.controller.mock";
import NavBarLogo from "../../navbar.logo/navbar.logo.component";
import NavBarMobileMenu from "../../navbar.mobile.menu/navbar.mobile.menu.component";
import NavBarOptions from "../../navbar.options/navbar.options.component";
import NavBarSessionControlContainer from "../../navbar.session.control/navbar.session.control.container";
import NavBarSpinner from "../../navbar.spinner/navbar.spinner.component";
import NavBarRoot, { testIDs } from "../navbar.root.component";
import navConfig from "@src/config/navbar";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import mockColourHook from "@src/hooks/__mocks__/colour.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "@src/tests/fixtures/mock.component.props";

jest.mock("@src/hooks/colour");

jest.mock("../../navbar.colour.mode/navbar.colour.mode.container", () =>
  require("@fixtures/react/parent").createComponent("NavBarColourModeContainer")
);

jest.mock("../../navbar.logo/navbar.logo.component", () =>
  require("@fixtures/react/parent").createComponent("NavBarLogo")
);

jest.mock("../../navbar.mobile.menu/navbar.mobile.menu.component", () =>
  require("@fixtures/react/child").createComponent("NavBarMobileMenu")
);

jest.mock("../../navbar.options/navbar.options.component", () =>
  require("@fixtures/react/parent").createComponent("NavBarOptions")
);

jest.mock("../../navbar.session.control/navbar.session.control.container", () =>
  require("@fixtures/react/child").createComponent(
    "NavBarSessionControlContainer"
  )
);

jest.mock("../../navbar.spinner/navbar.spinner.component", () =>
  require("@fixtures/react/parent").createComponent("NavBarSpinner")
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarRoot
        analytics={{ trackButtonClick: mockAnalyticsHook.trackButtonClick }}
        config={mockConfig}
        controls={mockControllerHook.controls}
        transaction={mockTransaction}
        rootReference={mockControllerHook.rootReference}
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
        !mockControllerHook.controls.hamburger.state
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
        closeMobileMenu: mockControllerHook.controls.mobileMenu.setFalse,
        currentPath: mockRouterHook.path,
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
          closeMobileMenu: mockControllerHook.controls.mobileMenu.setFalse,
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
          closeMobileMenu: mockControllerHook.controls.mobileMenu.setFalse,
          config: mockConfig,
          currentPath: mockRouterHook.path,
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
          controls: mockControllerHook.controls,
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
        mockControllerHook.controls.mobileMenu.state = false;

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
        mockControllerHook.controls.mobileMenu.state = true;

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
