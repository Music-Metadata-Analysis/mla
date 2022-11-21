import { LockIcon } from "@chakra-ui/icons";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import NavBarSessionControlContainer from "../navbar.session.control.container";
import authenticationTranslocations from "@locales/authentication.json";
import { testIDs as modalIDs } from "@src/components/authentication/modals/modal.signin.component";
import mockAuthHook, { mockUserProfile } from "@src/hooks/__mocks__/auth.mock";
import { _t } from "@src/hooks/__mocks__/locale.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/auth");

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/router");

jest.mock("@chakra-ui/icons", () =>
  require("@fixtures/chakra/icons").createChakraIconMock(["LockIcon"])
);

jest.mock("react-icons/ri", () =>
  require("@fixtures/react/child").createComponent(
    "RiLogoutBoxRLine",
    "RiLogoutBoxRLine"
  )
);

jest.mock(
  "@src/components/analytics/analytics.button/analytics.button.component",
  () => require("@fixtures/react/parent").createComponent("AnalyticsWrapper")
);

jest.mock("@src/components/scrollbar/vertical.scrollbar.component", () =>
  require("@fixtures/react/child").createComponent("VerticalScrollBar")
);

describe("NavBarSessionControlContainer", () => {
  const mockCloseMobileMenu = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarSessionControlContainer closeMobileMenu={mockCloseMobileMenu} />
    );
  };

  describe("when the user is logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = mockUserProfile;
      mockAuthHook.status = "authenticated";
      arrange();
    });

    it("should render the RiLogoutBoxRLine icon.", () => {
      expect(RiLogoutBoxRLine).toBeCalledTimes(1);
      checkMockCall(RiLogoutBoxRLine, { size: 20, "data-testid": "signOut" });
    });

    describe("when the button is clicked", () => {
      beforeEach(async () => {
        const button = await screen.findByTestId("signOut");
        fireEvent.click(button);
      });

      it("should close the mobile menu", async () => {
        await waitFor(async () =>
          expect(mockCloseMobileMenu).toBeCalledTimes(1)
        );
        expect(mockCloseMobileMenu).toBeCalledWith();
      });

      it("should call signOut once", async () => {
        expect(mockAuthHook.signOut).toBeCalledTimes(1);
        expect(mockAuthHook.signOut).toBeCalledWith();
      });
    });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockAuthHook.user = null;
      mockAuthHook.status = "unauthenticated";
      arrange();
    });

    it("should render the LockIcon", () => {
      expect(LockIcon).toBeCalledTimes(1);
      checkMockCall(LockIcon, { w: 5, h: 5, "data-testid": "signIn" });
    });

    describe("when the button is clicked", () => {
      beforeEach(async () => {
        jest.clearAllMocks();
        const button = await screen.findByTestId("signIn");
        fireEvent.click(button);
      });

      it("should close the mobile menu", async () => {
        await waitFor(async () =>
          expect(mockCloseMobileMenu).toBeCalledTimes(1)
        );
        expect(mockCloseMobileMenu).toBeCalledWith();
      });

      it("should show the authentication modal ", async () => {
        await waitFor(async () =>
          expect(
            await screen.findByText(_t(authenticationTranslocations.title))
          ).toBeVisible()
        );
      });

      describe("when the modal is closed", () => {
        beforeEach(async () => {
          const closeButton = await screen.findByTestId(
            modalIDs.AuthenticationModalCloseButton
          );
          fireEvent.click(closeButton);
        });

        it("should NOT route back", async () => {
          expect(mockRouterHook.back).toBeCalledTimes(0);
        });
      });
    });
  });
});
