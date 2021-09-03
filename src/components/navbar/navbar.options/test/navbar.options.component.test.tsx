import { render } from "@testing-library/react";
import * as router from "next/router";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import NavLink from "../../navbar.link/navbar.link.component";
import NavLinkOptions from "../navbar.options.component";

jest.mock("../../navbar.link/navbar.link.component");

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const mockConfig = {
  mockPath: "/mockPath",
  otherPath: "/otherPath",
};
const translationPrefix = "menu";

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
          href: mockConfig.mockPath,
          selected: false,
          children: `${translationPrefix}.mockPath`,
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.otherPath,
          selected: false,
          children: `${translationPrefix}.otherPath`,
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
    });
  });

  describe("When rendered with a selection", () => {
    beforeEach(() => arrange(mockConfig.mockPath));

    it("should call NavLink appropriately", () => {
      expect(NavLink).toBeCalledTimes(2);
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.mockPath,
          selected: true,
          children: `${translationPrefix}.mockPath`,
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
      expect(NavLink).toBeCalledWith(
        {
          href: mockConfig.otherPath,
          selected: false,
          children: `${translationPrefix}.otherPath`,
          trackButtonClick: mockAnalyticsHook.trackButtonClick,
        },
        {}
      );
    });
  });
});
