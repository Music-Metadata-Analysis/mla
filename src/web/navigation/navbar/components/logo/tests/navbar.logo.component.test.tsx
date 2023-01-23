import { render } from "@testing-library/react";
import NavBarLinkContainer from "../../link/navbar.link.container";
import NavBarLogo from "../navbar.logo.component";
import navbarTranslations from "@locales/navbar.json";
import routes from "@src/config/routes";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import NavBarAvatar from "@src/web/navigation/navbar/components/avatar/navbar.avatar.component";

jest.mock(
  "@src/web/navigation/navbar/components/avatar/navbar.avatar.component",
  () => require("@fixtures/react/child").createComponent("NavBarAvatar")
);

jest.mock(
  "@src/web/navigation/navbar/components/link/navbar.link.container",
  () => require("@fixtures/react/parent").createComponent("NavBarLink")
);

describe("NavBarLogo", () => {
  let mockCurrentPath: string;
  let mockTransaction: boolean;

  const mockAuthData = {
    name: "mockUser",
    image: "https://mock/profile/url",
  };

  const mockNavBarT = new MockUseTranslation("navbar").t;
  const mockCloseMobileMenu = jest.fn();
  const mockTracker = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarLogo
        closeMobileMenu={mockCloseMobileMenu}
        currentPath={mockCurrentPath}
        navBarT={mockNavBarT}
        tracker={mockTracker}
        transaction={mockTransaction}
        user={mockAuthData}
      />
    );
  };

  const checkNavBarLink = () => {
    it("should render the title NavBarLinkContainer with the correct props", () => {
      expect(NavBarLinkContainer).toBeCalledTimes(1);
      expect(NavBarLinkContainer).toBeCalledWith(
        {
          closeMobileMenu: mockCloseMobileMenu,
          children: _t(navbarTranslations.title),
          selected: routes.home === mockCurrentPath,
          path: routes.home,
          tracker: mockTracker,
          transaction: mockTransaction,
        },
        {}
      );
    });
  };

  const checkNavBarAvatar = () => {
    it("should render the Avatar with the correct props", () => {
      expect(NavBarAvatar).toBeCalledTimes(1);
      expect(NavBarAvatar).toBeCalledWith(
        {
          user: mockAuthData,
        },
        {}
      );
    });
  };

  const scenario1 = () => {
    describe("when the currentPath is NOT home", () => {
      beforeEach(() => {
        mockCurrentPath = routes.about;

        arrange();
      });

      checkNavBarLink();
      checkNavBarAvatar();
    });
  };

  const scenario2 = () => {
    describe("when the currentPath is home", () => {
      beforeEach(() => {
        mockCurrentPath = routes.home;

        arrange();
      });

      checkNavBarLink();
      checkNavBarAvatar();
    });
  };

  describe("when there is a transaction", () => {
    beforeEach(() => (mockTransaction = true));

    scenario1();
    scenario2();
  });

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (mockTransaction = false));

    scenario1();
    scenario2();
  });
});
