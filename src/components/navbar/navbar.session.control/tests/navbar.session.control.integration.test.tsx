import { LockIcon } from "@chakra-ui/icons";
import { fireEvent, render, screen } from "@testing-library/react";
import { signOut } from "next-auth/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { RiLogoutBoxRLine } from "react-icons/ri";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import mockRouter from "../../../../tests/fixtures/mock.router";
import Authentication from "../../../authentication/authentication.container";
import { testIDs as modalIDs } from "../../../authentication/modals/modal.signin.component";
import NavBarSessionControl from "../navbar.session.control.component";

jest.mock(
  "../../../analytics/analytics.button/analytics.button.component",
  () => createMockedComponent("AnalyticsWrapper")
);

jest.mock("../../../authentication/authentication.container", () => {
  const Component = jest.requireActual(
    "../../../authentication/authentication.container"
  ).default;
  return jest.fn((props) => <Component {...props} />);
});

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@chakra-ui/icons", () => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.chakra.icon.factory.class");
  const instance = factoryInstance.create(["LockIcon"]);
  instance.useColorMode = jest.fn();
  return instance;
});

jest.mock("react-icons/ri", () => ({
  RiLogoutBoxRLine: jest
    .fn()
    .mockImplementation((props) => <div {...props}>MockRiLogoutBoxRLine</div>),
}));

jest.mock("../../../scrollbar/vertical.scrollbar.component", () =>
  jest.fn(() => <div>MockVerticalScrollBar</div>)
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockUseSession = jest.fn();

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
      mockUseSession.mockReturnValue({ data: {}, status: "authenticated" });
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
        expect(signOut).toBeCalledTimes(1);
        expect(signOut).toBeCalledWith();
      });
    });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
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
