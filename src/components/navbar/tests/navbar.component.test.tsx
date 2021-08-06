import { IconButton } from "@chakra-ui/react";
import { render, screen, within } from "@testing-library/react";
import { HomePage } from "../../../config/lastfm";
import NavConfig from "../../../config/navbar";
import NavBar, { testIDs } from "../navbar.component";
import NavBarLogo from "../navbar.logo/navbar.logo.component";
import NavBarOptions from "../navbar.options/navbar.options.component";
import NavSpinner from "../navbar.spinner/navbar.spinner.component";
import type { LastFMTopAlbumsReportResponseInterface } from "../../../types/clients/api/reports/lastfm.types";
import type { UserStateInterface } from "../../../types/user/state.types";

const mockedComponents = {
  NavBarLogo: "NavBarLogo",
  NavBarOptions: "NavBarOptions",
  NavSpinner: "NavSpinner",
};

const createMockedComponent = (name: string) => {
  const {
    mockComponentWithChildrenFactory,
  } = require("../../../tests/fixtures/mock.factory.class");
  return mockComponentWithChildrenFactory.create(name);
};

jest.mock("../navbar.logo/navbar.logo.component", () =>
  createMockedComponent("NavBarLogo")
);
jest.mock("../navbar.options/navbar.options.component", () =>
  createMockedComponent("NavBarOptions")
);
jest.mock("../navbar.spinner/navbar.spinner.component", () =>
  createMockedComponent("NavSpinner")
);

jest.mock("@chakra-ui/react", () => {
  const original = jest.requireActual("@chakra-ui/react");
  const OriginalButton = original["IconButton"];
  return {
    ...original,
    IconButton: jest
      .fn()
      .mockImplementation(({ props }) => (
        <OriginalButton data-testid={"NavBarMobileMenuButton"} {...props} />
      )),
  };
});

jest.mock("../../../hooks/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      userProperties: getMockedUserProperties(),
    };
  });
});

const getMockedUserProperties = () => mockUserProperties;
let mockUserProperties: UserStateInterface = {
  data: {
    integration: null,
    report: {
      albums: [],
      image: [],
    },
  },
  error: false,
  profileUrl: null,
  ratelimited: false,
  ready: true,
  userName: null,
};

// todo: check all props

describe("NavBar", () => {
  const config = NavConfig;
  const baseMockUserProperties = { ...mockUserProperties };
  let thisMockUserProperties = { ...baseMockUserProperties };
  const mockProfileUrl = "http://profile.com/image";
  const mockImageUrl = "http://someurl.com";
  const mockLastFMReportNoData: LastFMTopAlbumsReportResponseInterface = {
    albums: [],
    image: [],
  };
  const mockLastFMReportData: LastFMTopAlbumsReportResponseInterface = {
    albums: [],
    image: [
      {
        size: "small",
        "#text": mockImageUrl,
      },
    ],
  };

  beforeEach(() => {
    thisMockUserProperties = { ...baseMockUserProperties };
    jest.clearAllMocks();
  });

  const arrange = () => {
    mockUserProperties = { ...thisMockUserProperties };
    render(<NavBar menuConfig={config} />);
  };

  describe("when data is pending", () => {
    beforeEach(() => {
      thisMockUserProperties.ready = false;
      arrange();
    });

    it("should render the logo component with defaults", async () => {
      expect(
        await screen.findByTestId(mockedComponents.NavBarLogo)
      ).toBeTruthy();
      expect(NavBarLogo).toBeCalledTimes(1);
      const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
      expect(call.href).toBe(HomePage);
      expect(call.image).toBe("");
    });
    it("should render the spinner component", async () => {
      expect(
        await screen.findByTestId(mockedComponents.NavSpinner)
      ).toBeTruthy();
      expect((NavSpinner as jest.Mock).mock.calls[0][0].whileTrue).toBeTruthy();
    });
    it("should render the menu once, inside the spinner", async () => {
      const spinner = await screen.findByTestId(mockedComponents.NavSpinner);
      within(spinner).findByTestId(testIDs.NavBarMenu);
    });
    it("should render the menu options once, inside the menu", async () => {
      const menu = await screen.findByTestId(testIDs.NavBarMenu);
      within(menu).findByTestId(mockedComponents.NavBarOptions);
      expect(NavBarOptions).toBeCalledTimes(1);
    });
    it("should NOT render the mobile menu", async () => {
      expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
    });
    it("should render the menu button with the right props", () => {
      expect(IconButton).toBeCalledTimes(1);
      const call = (IconButton as jest.Mock).mock.calls[0][0];
      expect(call.display).toStrictEqual({ sm: "none" });
    });
  });
  describe("when data is not pending", () => {
    beforeEach(() => {
      thisMockUserProperties.ready = true;
    });

    describe("with user data received", () => {
      beforeEach(() => {
        thisMockUserProperties.profileUrl = mockProfileUrl;
        thisMockUserProperties.ready = true;
        thisMockUserProperties.data.integration = "LAST.FM";
        thisMockUserProperties.data.report = { ...mockLastFMReportData };
        arrange();
      });

      it("should render the logo component with user data", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavBarLogo)
        ).toBeTruthy();
        expect(NavBarLogo).toBeCalledTimes(1);
        const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
        expect(call.href).toBe(mockProfileUrl);
        expect(call.image).toBe(mockImageUrl);
      });
      it("should NOT render the spinner component", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavSpinner)
        ).toBeTruthy();
        expect(
          (NavSpinner as jest.Mock).mock.calls[0][0].whileTrue
        ).toBeFalsy();
      });
      it("should render the menu component once", async () => {
        expect(await screen.findByTestId(testIDs.NavBarMenu));
      });
      it("should render the menu options, inside the menu", async () => {
        const menu = await screen.findByTestId(testIDs.NavBarMenu);
        within(menu).findByTestId(mockedComponents.NavBarOptions);
      });
      it("should NOT render the mobile menu", async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
      });
      it("should render the menu button with the right props", () => {
        expect(IconButton).toBeCalledTimes(1);
        const call = (IconButton as jest.Mock).mock.calls[0][0];
        expect(call.display).toStrictEqual({ sm: "none" });
      });
    });
    describe("with no user data", () => {
      beforeEach(() => {
        thisMockUserProperties.ready = true;
        thisMockUserProperties.data.integration = "LAST.FM";
        thisMockUserProperties.data.report = { ...mockLastFMReportNoData };
        arrange();
      });

      it("should render the logo component with defaults", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavBarLogo)
        ).toBeTruthy();
        expect(NavBarLogo).toBeCalledTimes(1);
        const call = (NavBarLogo as jest.Mock).mock.calls[0][0];
        expect(call.href).toBe(HomePage);
        expect(call.image).toBe("");
      });
      it("should NOT render the spinner component", async () => {
        expect(
          await screen.findByTestId(mockedComponents.NavSpinner)
        ).toBeTruthy();
        expect(
          (NavSpinner as jest.Mock).mock.calls[0][0].whileTrue
        ).toBeFalsy();
      });
      it("should render the menu component once", async () => {
        expect(await screen.findByTestId(testIDs.NavBarMenu));
      });
      it("should render the menu options, inside the menu", async () => {
        const menu = await screen.findByTestId(testIDs.NavBarMenu);
        within(menu).findByTestId(mockedComponents.NavBarOptions);
      });
      it("should NOT render the mobile menu", async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
      });
      it("should render the menu button with the right props", () => {
        expect(IconButton).toBeCalledTimes(1);
        const call = (IconButton as jest.Mock).mock.calls[0][0];
        expect(call.display).toStrictEqual({ sm: "none" });
      });
    });
  });
});
