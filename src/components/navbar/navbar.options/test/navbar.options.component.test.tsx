import { render } from "@testing-library/react";
import * as router from "next/router";
import NavLink from "../../navbar.link/navbar.link.component";
import NavLinkOptions from "../navbar.options.component";
import navbarTranslations from "@locales/navbar.json";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("../../navbar.link/navbar.link.component");

const mockConfig = {
  about: "/mockPath",
  search: "/otherPath",
};

describe("NavBarOptions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (NavLink as jest.Mock).mockImplementation(() => <div>MockNavLink</div>);
  });

  const arrange = (pathname: string) => {
    (jest.spyOn(router, "useRouter") as jest.Mock).mockImplementationOnce(
      () => ({
        pathname,
      })
    );
    render(<NavLinkOptions menuConfig={mockConfig} />);
  };

  describe("When rendered without a selection", () => {
    beforeEach(() => arrange("/not/a/matching/path"));

    it("should call NavLink appropriately", () => {
      expect(NavLink).toBeCalledTimes(2);
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.about,
          selected: false,
          children: _t(navbarTranslations.menu.about),
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.search,
          selected: false,
          children: _t(navbarTranslations.menu.search),
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
    });
  });

  describe("When rendered with a selection", () => {
    beforeEach(() => arrange(mockConfig.about));

    it("should call NavLink appropriately", () => {
      expect(NavLink).toBeCalledTimes(2);
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.about,
          selected: true,
          children: _t(navbarTranslations.menu.about),
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.search,
          selected: false,
          children: _t(navbarTranslations.menu.search),
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
    });
  });
});
