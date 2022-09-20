import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, IconButton, Stack } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import ReactDOMServer from "react-dom/server";
import NavConfig from "../../../config/navbar";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import mockLastFMHook from "../../../hooks/tests/lastfm.mock.hook";
import mockNavBarHook from "../../../hooks/tests/navbar.mock.hook";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import {
  getMockComponentProp,
  getMockComponentPropCount,
} from "../../../tests/fixtures/mock.component.props";
import NavBarColorModeToggle from "../navbar.color.mode/navbar.color.mode.component";
import NavBar, { testIDs } from "../navbar.component";
import NavBarLogo from "../navbar.logo/navbar.logo.component";
import NavBarOptions from "../navbar.options/navbar.options.component";
import NavBarSessionControl from "../navbar.session.control/navbar.session.control.component";
import NavSpinner from "../navbar.spinner/navbar.spinner.component";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../types/clients/api/lastfm/response.types";

jest.mock("@chakra-ui/icons", () => ({
  CloseIcon: jest.fn(() => <div>{"CloseIconMock"}</div>),
  HamburgerIcon: jest.fn(() => <div>{"HamburgerIconMock"}</div>),
}));

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

jest.mock("../../../hooks/navbar", () => {
  return () => mockNavBarHook;
});

jest.mock("../../../hooks/lastfm", () => {
  return () => mockLastFMHook;
});

jest.mock("../navbar.color.mode/navbar.color.mode.component", () =>
  createMockedComponent("NavBarColorModeToggle")
);

jest.mock("../navbar.logo/navbar.logo.component", () =>
  createMockedComponent("NavBarLogo")
);

jest.mock("../navbar.options/navbar.options.component", () =>
  createMockedComponent("NavBarOptions")
);

jest.mock("../navbar.session.control/navbar.session.control.component", () =>
  createMockedComponent("NavBarSession")
);

jest.mock("../navbar.spinner/navbar.spinner.component", () =>
  createMockedComponent("NavSpinner")
);

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  return {
    ...factoryInstance.create(["Box", "Flex", "HStack", "IconButton", "Stack"]),
    useDisclosure: () => mockUseDisclosure,
  };
});

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockedComponents = {
  NavBarLogo: "NavBarLogo",
  NavBarOptions: "NavBarOptions",
  NavSpinner: "NavSpinner",
};

const mockUseDisclosure = {
  isOpen: true,
  onOpen: jest.fn(),
  onClose: jest.fn(),
};

describe("NavBar", () => {
  const config = NavConfig.menuConfig;

  const mockProfileUrl = "http://profile.com/image";
  const mockImageUrl = "http://someurl.com";

  const baseMockUserProperties = {
    data: {
      integration: null,
      report: {
        albums: [],
        image: [],
        playcount: 0,
      },
    },
    error: null,
    inProgress: false,
    profileUrl: null,
    ready: true,
    retries: 3,
    userName: null,
  };

  const mockLastFMReportNoData: LastFMTopAlbumsReportResponseInterface = {
    albums: [],
    image: [],
    playcount: 0,
  };

  const mockLastFMReportData: LastFMTopAlbumsReportResponseInterface = {
    albums: [],
    image: [
      {
        size: "small",
        "#text": mockImageUrl,
      },
    ],
    playcount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetUserProperties();
  });

  const resetUserProperties = () => {
    mockLastFMHook.userProperties = JSON.parse(
      JSON.stringify(baseMockUserProperties)
    );
  };

  const arrange = () => {
    render(<NavBar menuConfig={config} />);
  };

  const checkProp = (
    args: { component: unknown; call: number },
    propName: string,
    result: unknown
  ) => {
    expect(getMockComponentProp({ ...args, propName })).toStrictEqual(result);
  };

  const checkChakraBoxComponent = () => {
    it("should render the Chakra Box component with the expected props", () => {
      expect((Box as jest.Mock).mock.calls.length).toBeGreaterThan(0);
      checkMockCall(Box, {
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
      expect(Flex).toBeCalledTimes(2);
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
    });

    it("should render the NavBarMenu Flex component, inside the NavSpinner component", async () => {
      const spinner = await screen.findByTestId(mockedComponents.NavSpinner);
      within(spinner).findByTestId(testIDs.NavBarMenu);
    });
  };

  const checkChakraIconButtonComponent = ({
    isOpen,
    disabled,
  }: {
    isOpen: boolean;
    disabled: boolean;
  }) => {
    it("should render the Menu Hamburger Button with the right props", () => {
      expect(IconButton).toBeCalledTimes(1);
      const iconRender = { component: IconButton, call: 0 };

      expect(getMockComponentPropCount(iconRender)).toBe(8);
      checkProp(iconRender, "aria-label", "Open Menu");
      checkProp(iconRender, "data-testid", testIDs.NavBarMobileMenuButton);
      checkProp(iconRender, "disabled", disabled);
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

  const checkChakraHStackComponent = () => {
    it("should render the Chakra HStack component with the expected props", () => {
      expect(HStack).toBeCalledTimes(2);
      checkMockCall(
        HStack,
        {
          spacing: 8,
          alignItems: "center",
        },
        0
      );
      checkMockCall(
        HStack,
        {
          as: "nav",
          spacing: 2,
          display: { base: "none", sm: "flex" },
        },
        1
      );
    });
  };

  const checkChakraStackComponent = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) {
      it("should NOT render the Chakra Stack component", () => {
        expect(Stack).toBeCalledTimes(0);
      });
    } else {
      it("should render the Chakra Stack component with the expected props", () => {
        expect(Stack).toBeCalledTimes(1);
        checkMockCall(
          Stack,
          {
            as: "nav",
            spacing: 4,
          },
          0
        );
      });
    }
  };

  const checkLogoComponent = () => {
    it("should render the NavBarLogo component with the expected props", async () => {
      expect(NavBarLogo).toBeCalledTimes(1);
      checkMockCall(NavBarLogo, {});
    });
  };

  const checkSpinnerComponent = ({ pending }: { pending: boolean }) => {
    it("should render the NavSpinner component with the expected props", async () => {
      expect(NavSpinner).toBeCalledTimes(1);
      checkMockCall(NavSpinner, { whileTrue: pending });
    });
  };

  const checkColourToggleComponent = () => {
    it("should render the NavBarColorModeToggle component with the expected props", () => {
      expect(NavBarColorModeToggle).toBeCalledTimes(1);
      checkMockCall(NavBarColorModeToggle, {}, 0);
    });
  };

  const checkSessionControllerComponent = () => {
    it("should render the NavBarSessionControl component with the expected props", () => {
      expect(NavBarSessionControl).toBeCalledTimes(1);
      checkMockCall(NavBarSessionControl, {}, 0);
    });
  };

  const checkMenuOptionsComponent = ({ isOpen }: { isOpen: boolean }) => {
    it("should render the NavBarOptions component inside the menu Flex component", async () => {
      const menu = await screen.findByTestId(testIDs.NavBarMenu);
      within(menu).findByTestId(mockedComponents.NavBarOptions);
      checkMockCall(NavBarOptions, { menuConfig: config }, 0);
    });

    if (!isOpen) {
      it("should NOT render the mobile menu NavBarOptions component", () => {
        expect(NavBarOptions).toBeCalledTimes(1);
      });
    }
  };

  const checkMobileMenuComponent = ({ isOpen }: { isOpen: boolean }) => {
    if (!isOpen) {
      it("should NOT render the mobile menu", () => {
        expect(Box).toBeCalledTimes(1);
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
      });
    } else {
      it("should render the mobile menu Chakra Box component with the expected props", () => {
        expect(Box).toBeCalledTimes(2);
        checkMockCall(
          Box,
          {
            "data-testid": testIDs.NavBarMobileMenu,
            pb: 4,
            display: { sm: "none" },
          },
          1
        );
      });

      it("should ALSO render the mobile menu NavBarOptions component inside the mobile menu Box component", async () => {
        expect(NavBarOptions).toBeCalledTimes(2);
        const menu = await screen.findByTestId(testIDs.NavBarMobileMenu);
        within(menu).findByTestId(mockedComponents.NavBarOptions);
        checkMockCall(NavBarOptions, { menuConfig: config }, 1);
      });
    }
  };

  describe("when the state has been programmed to NOT show the navbar", () => {
    beforeEach(() => {
      mockNavBarHook.getters.isVisible = false;
    });

    describe("when rendered", () => {
      beforeEach(() => {
        mockLastFMHook.userProperties.ready = true;
        arrange();
      });

      it("should NOT render the navbar at all", () => {
        expect(screen.queryByTestId(testIDs.NavBarRoot)).toBeNull();
      });
    });
  });

  describe("when the state has been programmed to show the navbar", () => {
    beforeEach(() => {
      mockNavBarHook.getters.isVisible = true;
    });

    describe("when data is pending", () => {
      beforeEach(() => {
        mockLastFMHook.userProperties.ready = false;
      });

      describe("when the menu is closed", () => {
        beforeEach(() => {
          mockUseDisclosure.isOpen = false;
          arrange();
        });

        checkChakraBoxComponent();
        checkChakraFlexComponent();
        checkChakraIconButtonComponent({ isOpen: false, disabled: false });
        checkChakraHStackComponent();
        checkChakraStackComponent({ isOpen: false });
        checkLogoComponent();
        checkSpinnerComponent({ pending: true });
        checkColourToggleComponent();
        checkSessionControllerComponent();
        checkMenuOptionsComponent({ isOpen: false });
        checkMobileMenuComponent({ isOpen: false });
      });
    });

    describe("when data is not pending", () => {
      beforeEach(() => {
        mockLastFMHook.userProperties.ready = true;
      });

      const userDataReceived = () => {
        mockLastFMHook.userProperties.profileUrl = mockProfileUrl;
        mockLastFMHook.userProperties.ready = true;
        mockLastFMHook.userProperties.data.integration = "LAST.FM";
        mockLastFMHook.userProperties.data.report = {
          ...mockLastFMReportData,
        };
      };

      const noUserDataReceived = () => {
        mockLastFMHook.userProperties.profileUrl = "";
        mockLastFMHook.userProperties.ready = true;
        mockLastFMHook.userProperties.data.integration = "LAST.FM";
        mockLastFMHook.userProperties.data.report = {
          ...mockLastFMReportNoData,
        };
      };

      describe("when the menu is closed", () => {
        beforeEach(() => (mockUseDisclosure.isOpen = false));

        describe("when the hamburger is disabled", () => {
          beforeEach(() => (mockNavBarHook.getters.isHamburgerEnabled = false));

          describe("with user data received", () => {
            beforeEach(() => {
              userDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: false, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: false });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: false });
            checkMobileMenuComponent({ isOpen: false });
          });

          describe("with no user data", () => {
            beforeEach(() => {
              noUserDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: false, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: false });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: false });
            checkMobileMenuComponent({ isOpen: false });
          });
        });

        describe("when the hamburger is enabled", () => {
          beforeEach(() => (mockNavBarHook.getters.isHamburgerEnabled = true));

          describe("with user data received", () => {
            beforeEach(() => {
              userDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: false, disabled: false });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: false });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: false });
            checkMobileMenuComponent({ isOpen: false });
          });

          describe("with no user data", () => {
            beforeEach(() => {
              noUserDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: false, disabled: false });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: false });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: false });
            checkMobileMenuComponent({ isOpen: false });
          });
        });
      });

      describe("when the menu is open", () => {
        beforeEach(() => (mockUseDisclosure.isOpen = true));

        describe("when the hamburger is disabled", () => {
          beforeEach(() => (mockNavBarHook.getters.isHamburgerEnabled = false));

          describe("with user data received", () => {
            beforeEach(() => {
              userDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: true, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: true });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: true });
            checkMobileMenuComponent({ isOpen: true });
          });

          describe("with no user data", () => {
            beforeEach(() => {
              noUserDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: true, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: true });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: true });
            checkMobileMenuComponent({ isOpen: true });
          });
        });

        describe("when the hamburger is enabled", () => {
          beforeEach(() => (mockNavBarHook.getters.isHamburgerEnabled = false));

          describe("with user data received", () => {
            beforeEach(() => {
              userDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: true, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: true });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: true });
            checkMobileMenuComponent({ isOpen: true });
          });

          describe("with no user data", () => {
            beforeEach(() => {
              noUserDataReceived();
              arrange();
            });

            checkChakraBoxComponent();
            checkChakraFlexComponent();
            checkChakraIconButtonComponent({ isOpen: true, disabled: true });
            checkChakraHStackComponent();
            checkChakraStackComponent({ isOpen: true });
            checkLogoComponent();
            checkSpinnerComponent({ pending: false });
            checkColourToggleComponent();
            checkSessionControllerComponent();
            checkMenuOptionsComponent({ isOpen: true });
            checkMobileMenuComponent({ isOpen: true });
          });
        });
      });
    });
  });
});
