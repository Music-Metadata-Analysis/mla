import { render, screen, within } from "@testing-library/react";
import NavBarAvatar from "../../navbar.avatar/navbar.avatar.component";
import NavBarLink from "../../navbar.link/navbar.link.component";
import NavBarLogo from "../navbar.logo.component";
import navbarTranslations from "@locales/navbar.json";
import routes from "@src/config/routes";
import mockAnalyticsHook from "@src/hooks/tests/analytics.mock.hook";
import { mockUseLocale, _t } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockRouter from "@src/tests/fixtures/mock.router";

jest.mock("next/router", () => ({ useRouter: () => mockRouter }));

jest.mock("@src/hooks/analytics", () => () => mockAnalyticsHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock("../../navbar.avatar/navbar.avatar.component", () => {
  return jest.fn().mockImplementation(() => <div>MockComponent</div>);
});

jest.mock("../../navbar.link/navbar.link.component", () =>
  require("@fixtures/react").createComponent("NavBarLink")
);

describe("NavBarLogo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    mockRouter.pathname = routes.home;
    render(<NavBarLogo />);
  };

  it("should render the title NavBarLink with the correct props", () => {
    expect(NavBarLink).toBeCalledTimes(1);
    checkMockCall(NavBarLink, {
      selected: routes.home === mockRouter.pathname,
      href: routes.home,
      trackButtonClick: mockAnalyticsHook.trackButtonClick,
    });
  });

  it("should render the title NavBarLink content correctly", async () => {
    const link = await screen.findByTestId("NavBarLink");
    expect(
      await within(link).findByText(_t(navbarTranslations.title))
    ).toBeTruthy();
  });

  it("should render the Avatar with the correct props", () => {
    expect(NavBarAvatar).toBeCalledTimes(1);
    checkMockCall(NavBarAvatar, {});
  });
});
