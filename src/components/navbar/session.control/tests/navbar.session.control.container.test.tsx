import { render } from "@testing-library/react";
import NavBarSessionControl from "../navbar.session.control.component";
import NavBarSessionControlContainer from "../navbar.session.control.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook, {
  mockUserProfile,
} from "@src/hooks/__mocks__/auth.hook.mock";

jest.mock("@src/hooks/auth.hook");

jest.mock("@src/hooks/locale.hook");

jest.mock("@src/hooks/router.hook");

jest.mock("../navbar.session.control.component", () =>
  require("@fixtures/react/child").createComponent("NavBarSessionControl")
);

jest.mock(
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

describe("NavBarSessionControlContainer", () => {
  const mockCloseMobileMenu = jest.fn();

  const propsUnauthenticated = {
    analyticsButtonName: "NavBar SignIn",
    buttonType: "signIn",
    showAuthenticationModal: false,
  };
  const propsAuthenticated = {
    analyticsButtonName: "NavBar SignOut",
    buttonType: "signOut",
    showAuthenticationModal: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarSessionControlContainer closeMobileMenu={mockCloseMobileMenu} />
    );
  };

  const checkSessionControlComponentTotalCalls = ({
    totalCalls,
  }: {
    totalCalls: number;
  }) => {
    it("should call the NavSessionControl component as expected", () => {
      expect(NavBarSessionControl).toBeCalledTimes(totalCalls);
    });
  };

  const checkSessionControlComponentCall = ({
    call,
    props,
  }: {
    call: number;
    props: Record<string, unknown>;
  }) => {
    it(`call #${call} of the NavSessionControl should have the expected props`, () => {
      checkMockCall(NavBarSessionControl, props, call, [
        "handleClick",
        "onAuthenticationModalClose",
      ]);
    });
  };

  describe("when the user is logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = mockUserProfile;
      mockAuthHook.status = "authenticated";

      arrange();
    });

    checkSessionControlComponentTotalCalls({ totalCalls: 2 });
    checkSessionControlComponentCall({ call: 0, props: propsUnauthenticated });
    checkSessionControlComponentCall({ call: 1, props: propsAuthenticated });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = null;
      mockAuthHook.status = "unauthenticated";

      arrange();
    });

    checkSessionControlComponentTotalCalls({ totalCalls: 1 });
    checkSessionControlComponentCall({ call: 0, props: propsUnauthenticated });
  });
});
