import { fireEvent, render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import routes from "../../../../config/routes";
import mockRouter from "../../../../tests/fixtures/mock.router";
import { testIDs as modalIDs } from "../../../authentication/authentication.component";
import Authentication from "../../../authentication/authentication.container";
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

    describe("when the button is clicked", () => {
      beforeEach(async () => {
        const button = await screen.findByTestId("signOut");
        fireEvent.click(button);
      });

      it("should route to home ", async () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(routes.home);
      });
    });
  });

  describe("when the user is NOT logged in", () => {
    beforeEach(() => {
      mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
      arrange();
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
