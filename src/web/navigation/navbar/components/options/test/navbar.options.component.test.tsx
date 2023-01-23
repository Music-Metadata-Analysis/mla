import { render } from "@testing-library/react";
import NavBarOptions from "../navbar.options.component";
import navbarTranslations from "@locales/navbar.json";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import NavLinkContainer from "@src/web/navigation/navbar/components/link/navbar.link.container";

jest.mock(
  "@src/web/navigation/navbar/components/link/navbar.link.container",
  () => require("@fixtures/react/child").createComponent("NavBarLinkContainer")
);

describe("NavBarOptions", () => {
  let mockCurrentPath: string;
  let mockTransaction: boolean;

  const mockNavBarT = new MockUseTranslation("navbar").t;
  const mockTracker = jest.fn();
  const mockCloseMobileMenu = jest.fn();

  const mockConfig = {
    about: "/mockPath",
    search: "/otherPath",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(NavLinkContainer)
      .mockImplementation(() => <div>MockNavLink</div>);
  });

  const arrange = () => {
    render(
      <NavBarOptions
        closeMobileMenu={mockCloseMobileMenu}
        config={mockConfig}
        currentPath={mockCurrentPath}
        navBarT={mockNavBarT}
        tracker={mockTracker}
        transaction={mockTransaction}
      />
    );
  };

  const checkNavLinkContainer = ({
    selections,
  }: {
    selections: Record<keyof typeof mockConfig, boolean>;
  }) => {
    it(`should call NavLinkContainer ${
      Object.keys(mockConfig).length
    } times`, () => {
      expect(NavLinkContainer).toBeCalledTimes(Object.keys(mockConfig).length);
    });

    (Object.keys(mockConfig) as Array<keyof typeof mockConfig>).forEach(
      (option, index) => {
        it(`should call NavLinkContainer for the '${option}' link correctly`, () => {
          expect(NavLinkContainer).toHaveBeenNthCalledWith(
            index + 1,
            {
              closeMobileMenu: mockCloseMobileMenu,
              path: mockConfig[option],
              selected: selections[option],
              children: _t(navbarTranslations.menu[option]),
              tracker: mockTracker,
              transaction: mockTransaction,
            },
            {}
          );
        });
      }
    );
  };

  const scenario1 = () => {
    describe("When rendered without a selection", () => {
      beforeEach(() => {
        mockCurrentPath = "/not/a/match";

        arrange();
      });

      checkNavLinkContainer({
        selections: { about: false, search: false },
      });
    });
  };

  const scenario2 = () => {
    describe("When rendered with about selected", () => {
      beforeEach(() => {
        mockCurrentPath = mockConfig.about;

        arrange();
      });

      checkNavLinkContainer({
        selections: { about: true, search: false },
      });
    });
  };

  const scenario3 = () => {
    describe("When rendered with search selected", () => {
      beforeEach(() => {
        mockCurrentPath = mockConfig.search;

        arrange();
      });

      checkNavLinkContainer({
        selections: { about: false, search: true },
      });
    });
  };

  describe("when there is a transaction", () => {
    beforeEach(() => (mockTransaction = true));

    scenario1();
    scenario2();
    scenario3();
  });

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (mockTransaction = false));

    scenario1();
    scenario2();
    scenario3();
  });
});
