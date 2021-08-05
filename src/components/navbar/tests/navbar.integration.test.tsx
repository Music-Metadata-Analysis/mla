import { render, screen, fireEvent, within } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { HomePage } from "../../../config/lastfm";
import NavConfig from "../../../config/navbar";
import translations from "../../../config/translations";
import mockAnalyticsHook from "../../../hooks/tests/analytics.mock";
import mockRouter from "../../../tests/fixtures/mock.router";
import { testIDs as NavBarAnalyticsTestIDs } from "../navbar.avatar/navbar.avatar.component";
import NavBar, { testIDs } from "../navbar.component";
import type { UserStateInterface } from "../../../types/user/state.types";

jest.mock("../../../hooks/lastfm", () => {
  return jest.fn().mockImplementation(() => {
    return {
      userProperties: getMockedUserProperties(),
    };
  });
});

jest.mock("../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

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

describe("NavBar", () => {
  const config: { [index: string]: string } = NavConfig;
  const clickAbleLinks = Object.keys(config);
  const baseMockUserProperties = { ...mockUserProperties };
  let thisMockUserProperties = { ...baseMockUserProperties };

  beforeEach(() => {
    thisMockUserProperties = { ...baseMockUserProperties };
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    mockUserProperties = { ...thisMockUserProperties };
    render(
      <RouterContext.Provider value={mockRouter}>
        <NavBar menuConfig={config} />
      </RouterContext.Provider>
    );
  };

  const clickByTestId = async (testId: string, searchRoot: HTMLElement) => {
    const link = (await within(searchRoot).findByTestId(testId)) as HTMLElement;
    fireEvent.click(link);
  };
  const clickByString = async (text: string, searchRoot: HTMLElement) => {
    const link = (await within(searchRoot).findByText(text)) as HTMLElement;
    fireEvent.click(link);
  };

  const testLink = (link: string, searchRootTestId: string) => {
    let destination = config[link];
    if (link === translations.app.title) destination = "/";

    describe(`when the "${link}" link is clicked`, () => {
      beforeEach(async () => {
        (mockRouter.push as jest.Mock).mockClear();
        const searchRoot = await screen.findByTestId(searchRootTestId);
        await clickByString(link, searchRoot);
      });

      it(`should produce an analytics event`, async () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe(link);
        expect(Object.keys(call).length).toBe(2);
      });

      it(`should route to ${destination}`, async () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(destination, destination, {
          locale: undefined,
          scroll: undefined,
          shallow: undefined,
        });
      });
    });
  };

  const clickMobileMenuButton = async () => {
    const searchRoot = await screen.findByTestId(testIDs.NavBarRoot);
    await clickByTestId(testIDs.NavBarMobileMenuButton, searchRoot);
  };

  describe("when rendered", () => {
    it("should display the title", async () => {
      expect(await screen.findByText(translations.app.title)).toBeTruthy();
    });
    it("should display the correct links", async () => {
      for (const linkText of Object.keys(NavConfig)) {
        expect(await screen.findByText(linkText)).toBeTruthy();
      }
    });

    describe("when the mobile menu button is clicked", () => {
      beforeEach(async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        await clickMobileMenuButton();
      });

      it("should display the mobile menu", async () => {
        expect(
          await screen.findByTestId(testIDs.NavBarMobileMenu)
        ).toBeTruthy();
      });
    });
    describe("when the mobile menu button is clicked twice", () => {
      beforeEach(async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        await clickMobileMenuButton();
        await clickMobileMenuButton();
      });

      it("should hide the mobile menu", async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
      });
    });

    describe("when navbar links are clicked", () => {
      for (let i = 0; i < clickAbleLinks.length; i++) {
        testLink(clickAbleLinks[i], testIDs.NavBarRoot);
      }
      testLink(translations.app.title, testIDs.NavBarRoot);
    });

    describe("when menubar links are clicked", () => {
      beforeEach(async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        await clickMobileMenuButton();
      });

      for (let i = 0; i < clickAbleLinks.length; i++) {
        testLink(clickAbleLinks[i], testIDs.NavBarMobileMenu);
      }
    });

    describe("when the avatar image is clicked", () => {
      beforeEach(async () => {
        const link = (await screen.findByAltText("LastFM")) as HTMLElement;
        fireEvent.click(link);
      });
      it(`should produce an analytics event`, async () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe("AVATAR: LASTFM");
        expect(Object.keys(call).length).toBe(2);
      });
      it(`the avatar should reference the external link correctly`, async () => {
        const link = (await screen.findByTestId(
          NavBarAnalyticsTestIDs.NavBarAvatarLink
        )) as HTMLElement;
        expect(link).toHaveAttribute("href", HomePage);
        expect(link).toHaveAttribute("target", "_blank");
      });
    });
  });
});
