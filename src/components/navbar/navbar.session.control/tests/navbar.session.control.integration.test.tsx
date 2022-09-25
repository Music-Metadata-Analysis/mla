import { LockIcon } from "@chakra-ui/icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { RiLogoutBoxRLine } from "react-icons/ri";
import NavBarSessionControl from "../navbar.session.control.component";
import Authentication from "@src/components/authentication/authentication.container";
import { testIDs as modalIDs } from "@src/components/authentication/modals/modal.signin.component";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import mockRouter from "@src/tests/fixtures/mock.router";

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock(
  "@src/components/analytics/analytics.button/analytics.button.component",
  () => createMockedComponent("AnalyticsWrapper")
);

jest.mock("@src/components/authentication/authentication.container", () => {
  const Component = jest.requireActual(
    "@src/components/authentication/authentication.container"
  ).default;
  return jest.fn((props) => <Component {...props} />);
});

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.chakra.icon.factory.class");
  const instance = factoryInstance.create(["LockIcon"]);
  instance.useColorMode = jest.fn();
  return instance;
});

jest.mock("react-icons/ri", () => ({
  RiLogoutBoxRLine: jest
    .fn()
    .mockImplementation((props) => <div {...props}>MockRiLogoutBoxRLine</div>),
}));

jest.mock("@src/components/scrollbar/vertical.scrollbar.component", () =>
  jest.fn(() => <div>MockVerticalScrollBar</div>)
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("@src/tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("NavSessionControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <NavBarSessionControl />
      </RouterContext.Provider>
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

      it("should show the authentication modal ", async () => {
        expect(Authentication).toBeCalledTimes(1);
      });

      describe("when the modal is closed", () => {
        beforeEach(async () => {
          const closeButton = await screen.findByTestId(
            modalIDs.AuthenticationModalCloseButton
          );
          fireEvent.click(closeButton);
        });

        it("should NOT route back", async () => {
          expect(mockRouter.back).toBeCalledTimes(0);
        });
      });
    });
  });
});
