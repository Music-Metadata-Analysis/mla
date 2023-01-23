import { render, screen, fireEvent, within } from "@testing-library/react";
import { testIDs as NavBarMobileMenuTestIDs } from "../mobile.menu/navbar.mobile.menu.identifiers";
import NavBarContainer from "../navbar.container";
import { testIDs as NavBarRootTestIDs } from "../root/navbar.root.identifiers";
import navbarTranslations from "@locales/navbar.json";
import NavConfig from "@src/config/navbar";
import { mockIsBuildTime } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import NavBarControllerProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import type { JSONstringType } from "@src/types/json.types";
import type { UserStateInterface } from "@src/types/user/state.types";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/hooks/lastfm.hook", () =>
  jest.fn(() => ({ userProperties: getMockedUserProperties() }))
);

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock(
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

const getMockedUserProperties = () => mockUserProperties;
let mockUserProperties: UserStateInterface = {
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

describe("NavBar", () => {
  const translationPrefix = "menu" as const;
  const config: { [index: string]: string } = NavConfig.menuConfig;
  const clickAbleLinks = Object.keys(config).map(
    (key) => (navbarTranslations[translationPrefix] as JSONstringType)[key]
  );
  const baseMockUserProperties = { ...mockUserProperties };
  let thisMockUserProperties = { ...baseMockUserProperties };

  beforeEach(() => {
    thisMockUserProperties = { ...baseMockUserProperties };
    mockAuthHook.user = mockUserProfile;
    jest.clearAllMocks();

    mockIsBuildTime.mockReturnValue(false);

    arrange();
  });

  const arrange = () => {
    mockUserProperties = { ...thisMockUserProperties };
    render(
      <NavBarControllerProvider>
        <NavBarContainer config={config} />
      </NavBarControllerProvider>
    );
  };

  const clickByTestId = async (testId: string, searchRoot: HTMLElement) => {
    const link = (await within(searchRoot).findByTestId(testId)) as HTMLElement;
    fireEvent.click(link);
  };
  const clickByString = async (text: string, searchRoot: HTMLElement) => {
    const link = (await within(searchRoot).findByText(_t(text))) as HTMLElement;
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
        jest.mocked(mockRouterHook.push).mockClear();
        const searchRoot = await screen.findByTestId(searchRootTestId);
        await clickByString(link, searchRoot);
      });

      it(`should produce an analytics event`, async () => {
        expect(mockAnalyticsHook.trackButtonClick).toBeCalledTimes(1);
        const call = mockAnalyticsHook.trackButtonClick.mock.calls[0];
        expect(call[0].constructor.name).toBe("SyntheticBaseEvent");
        expect(call[1]).toBe(_t(link));
        expect(Object.keys(call).length).toBe(2);
      });

      if (destination === "/") {
        it(`should route to ${destination}`, async () => {
          expect(mockRouterHook.push).toBeCalledTimes(1);
          expect(mockRouterHook.push).toBeCalledWith(destination);
        });
      } else {
        it(`should route to ${destination}`, async () => {
          expect(mockRouterHook.push).toBeCalledTimes(1);
          expect(mockRouterHook.push).toBeCalledWith(destination);
        });
      }

      if (mobileClick) {
        it(`should close the mobile menu`, () => {
          expect(
            screen.queryByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
          ).toBeNull();
        });
      }
    });
  };

  const clickMobileMenuButton = async () => {
    const searchRoot = await screen.findByTestId(NavBarRootTestIDs.NavBarRoot);
    await clickByTestId(NavBarRootTestIDs.NavBarMobileMenuButton, searchRoot);
  };

  describe("when rendered", () => {
    it("should display the title", async () => {
      expect(
        await screen.findByText(_t(navbarTranslations.title))
      ).toBeTruthy();
    });

    it("should display the correct links", async () => {
      const navBarMenu = await screen.findByTestId(
        NavBarRootTestIDs.NavBarMenu
      );

      for (const linkText of Object.keys(NavConfig.menuConfig)) {
        expect(
          await within(navBarMenu).findByText(
            _t(
              (navbarTranslations[translationPrefix] as JSONstringType)[
                linkText
              ]
            )
          )
        ).toBeTruthy();
      }
    });

    describe("when navbar links are clicked", () => {
      for (let i = 0; i < clickAbleLinks.length; i++) {
        testLink(clickAbleLinks[i], NavBarRootTestIDs.NavBarMenu);
      }
      testLink(navbarTranslations.title, NavBarRootTestIDs.NavBarRoot);
    });

    it("should NOT display the mobile menu", () => {
      expect(
        screen.queryByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
      ).toBeNull();
    });

    describe("when the mobile menu button is clicked", () => {
      beforeEach(async () => {
        expect(
          screen.queryByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
        ).toBeNull();
        await clickMobileMenuButton();
      });

      it("should display the mobile menu", async () => {
        expect(
          await screen.findByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
        ).toBeTruthy();
      });

      describe("when mobile menu links are clicked", () => {
        for (let i = 0; i < clickAbleLinks.length; i++) {
          testLink(
            clickAbleLinks[i],
            NavBarMobileMenuTestIDs.NavBarMobileMenu,
            true
          );
        }
      });
    });

    describe("when the mobile menu button is clicked twice", () => {
      beforeEach(async () => {
        expect(
          screen.queryByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
        ).toBeNull();
        await clickMobileMenuButton();
        await clickMobileMenuButton();
      });

      it("should hide the mobile menu", () => {
        expect(
          screen.queryByTestId(NavBarMobileMenuTestIDs.NavBarMobileMenu)
        ).toBeNull();
      });
    });
  });
});
