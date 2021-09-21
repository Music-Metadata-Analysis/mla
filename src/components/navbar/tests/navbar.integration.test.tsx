import { render, screen, fireEvent, within } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import mainTranslations from "../../../../public/locales/en/main.json";
import navbarTranslations from "../../../../public/locales/en/navbar.json";
import { HomePage } from "../../../config/lastfm";
import NavConfig from "../../../config/navbar";
import mockAnalyticsHook from "../../../hooks/tests/analytics.mock";
import NavBarProvider from "../../../providers/navbar/navbar.provider";
import mockRouter from "../../../tests/fixtures/mock.router";
import { testIDs as NavBarAnalyticsTestIDs } from "../navbar.avatar/navbar.avatar.component";
import NavBar, { testIDs } from "../navbar.component";
import type { JSONstringType } from "../../../types/json.types";
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
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

describe("NavBar", () => {
  const translationPrefix = "menu" as const;
  const config: { [index: string]: string } = NavConfig;
  const clickAbleLinks = Object.keys(config).map(
    (key) => (navbarTranslations[translationPrefix] as JSONstringType)[key]
  );
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
        <NavBarProvider>
          <NavBar menuConfig={config} />
        </NavBarProvider>
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

  const testLink = (
    link: string,
    searchRootTestId: string,
    mobileClick = false
  ) => {
    let destination = config[link.toLowerCase()];
    if (link === navbarTranslations.title) destination = "/";

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

      if (destination === "/") {
        it(`should route to ${destination}`, async () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(destination, destination, {
            locale: undefined,
            scroll: undefined,
            shallow: undefined,
          });
        });
      } else {
        it(`should route to ${destination}`, async () => {
          expect(mockRouter.push).toBeCalledTimes(1);
          expect(mockRouter.push).toBeCalledWith(destination);
        });
      }

      if (mobileClick) {
        it(`should close the mobile menu`, () => {
          expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        });
      }
    });
  };

  const clickMobileMenuButton = async () => {
    const searchRoot = await screen.findByTestId(testIDs.NavBarRoot);
    await clickByTestId(testIDs.NavBarMobileMenuButton, searchRoot);
  };

  describe("when rendered", () => {
    it("should display the title", async () => {
      expect(await screen.findByText(navbarTranslations.title)).toBeTruthy();
    });

    it("should display the correct links", async () => {
      for (const linkText of Object.keys(NavConfig)) {
        expect(
          await screen.findByText(
            (navbarTranslations[translationPrefix] as JSONstringType)[linkText]
          )
        ).toBeTruthy();
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
      testLink(navbarTranslations.title, testIDs.NavBarRoot);
    });

    describe("when mobile menu links are clicked", () => {
      beforeEach(async () => {
        expect(screen.queryByTestId(testIDs.NavBarMobileMenu)).toBeNull();
        await clickMobileMenuButton();
      });

      for (let i = 0; i < clickAbleLinks.length; i++) {
        testLink(clickAbleLinks[i], testIDs.NavBarMobileMenu, true);
      }
    });

    describe("when the avatar image is clicked", () => {
      beforeEach(async () => {
        const link = (await screen.findByAltText(
          mainTranslations.altText.lastfm
        )) as HTMLElement;
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
