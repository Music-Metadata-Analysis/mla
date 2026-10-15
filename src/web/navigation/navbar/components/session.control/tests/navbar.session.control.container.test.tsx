import { act, render, waitFor } from "@testing-library/react";
import NavBarSessionControl from "../navbar.session.control.component";
import NavBarSessionControlContainer from "../navbar.session.control.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("../navbar.session.control.component", () =>
  require("@fixtures/react/child").createComponent("NavBarSessionControl")
);

jest.mock(
  "@src/web/ui/scrollbars/vertical/components/vertical.scrollbar.container",
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

  const arrange = async () => {
    await act(async () => {
      render(
        <NavBarSessionControlContainer closeMobileMenu={mockCloseMobileMenu} />
      );
      await Promise.resolve();
    });
  };

  const checkSessionControlComponentTotalCalls = ({
    totalCalls,
  }: {
    totalCalls: number;
  }) => {
    it("should call the NavSessionControl component as expected", async () => {
      await waitFor(() =>
        expect(NavBarSessionControl).toHaveBeenCalledTimes(totalCalls)
      );
    });
  };

  const checkSessionControlComponentCall = ({
    call,
    props,
  }: {
    call: number;
    props: Record<string, unknown>;
  }) => {
    it(`call #${call} of the NavSessionControl should have the expected props`, async () => {
      await waitFor(() =>
        checkMockCall(NavBarSessionControl, props, call, [
          "handleClick",
          "onAuthenticationModalClose",
        ])
      );
    });
  };

  describe("when the user is logged in", () => {
    beforeEach(async () => {
      mockAuthHook.user = mockUserProfile;
      mockAuthHook.status = "authenticated";

      await arrange();
    });

    checkSessionControlComponentTotalCalls({ totalCalls: 2 });
    checkSessionControlComponentCall({ call: 0, props: propsUnauthenticated });
    checkSessionControlComponentCall({ call: 1, props: propsAuthenticated });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(async () => {
      mockAuthHook.user = null;
      mockAuthHook.status = "unauthenticated";

      await arrange();
    });

    checkSessionControlComponentTotalCalls({ totalCalls: 1 });
    checkSessionControlComponentCall({ call: 0, props: propsUnauthenticated });
  });
});
