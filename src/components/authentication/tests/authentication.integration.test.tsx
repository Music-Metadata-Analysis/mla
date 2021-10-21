import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import * as authClient from "next-auth/client";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../public/locales/en/authentication.json";
import routes from "../../../config/routes";
import ChakraProvider from "../../../providers/ui/ui.chakra/ui.chakra.provider";
import mockRouter from "../../../tests/fixtures/mock.router";
import { testIDs } from "../authentication.component";
import AuthenticationContainer from "../authentication.container";

jest.mock("next-auth/client", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => {
  const module = jest.requireActual("@chakra-ui/react");
  return {
    ...module,
    useDisclosure: () => mockUseDisclosure(),
  };
});

const mockUseDisclosure = jest.fn();
const mockUseSession = jest.fn();

describe("AuthenticationContainer", () => {
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <ChakraProvider>
          <AuthenticationContainer />
        </ChakraProvider>
      </RouterContext.Provider>
    );
  };

  describe("modal is open", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: true,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      });
    });

    describe("user is logged in", () => {
      beforeEach(() => {
        mockUseSession.mockReturnValue([{ user: true }, true]);
        arrange();
      });

      it("should display the modal title text", async () => {
        const title = await screen.findByTestId(
          testIDs.AuthenticationModalTitle
        );
        await waitFor(() => expect(title).toBeVisible());
        expect(await within(title).findByText(translations.title)).toBeTruthy();
      });

      it("should display the modal close button", async () => {
        const button = await screen.findByTestId(
          testIDs.AuthenticationModalCloseButton
        );
        await waitFor(() => expect(button).toBeVisible());
      });

      it("should display the modal facebook button", async () => {
        const buttons = await screen.findByTestId(
          testIDs.AuthenticationLoginButtons
        );
        await waitFor(() => expect(buttons).toBeVisible());
        expect(
          await within(buttons).findByText(translations.buttons.facebook)
        ).toBeTruthy();
      });

      it("should display the modal github button", async () => {
        const buttons = await screen.findByTestId(
          testIDs.AuthenticationLoginButtons
        );
        await waitFor(() => expect(buttons).toBeVisible());
        expect(
          await within(buttons).findByText(translations.buttons.github)
        ).toBeTruthy();
      });

      it("should display the modal google button", async () => {
        const buttons = await screen.findByTestId(
          testIDs.AuthenticationLoginButtons
        );
        await waitFor(() => expect(buttons).toBeVisible());
        expect(
          await within(buttons).findByText(translations.buttons.google)
        ).toBeTruthy();
      });

      describe("when the close button is clicked", () => {
        beforeEach(async () => {
          const button = await screen.findByTestId(
            testIDs.AuthenticationModalCloseButton
          );
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should route to the correct url", () => {
          expect(mockRouter.push).toBeCalledWith(routes.home);
        });
      });

      describe("when the facebook button is clicked", () => {
        beforeEach(async () => {
          const button = await screen.findByText(translations.buttons.facebook);
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should start the sign-in sequence", () => {
          expect(authClient.signIn).toBeCalledWith("facebook");
        });
      });

      describe("when the github button is clicked", () => {
        beforeEach(async () => {
          const button = await screen.findByText(translations.buttons.github);
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should start the sign-in sequence", () => {
          expect(authClient.signIn).toBeCalledWith("github");
        });
      });

      describe("when the google button is clicked", () => {
        beforeEach(async () => {
          const button = await screen.findByText(translations.buttons.google);
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should start the sign-in sequence", () => {
          expect(authClient.signIn).toBeCalledWith("google");
        });
      });
    });
  });

  describe("modal is closed", () => {
    beforeEach(() => {
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      });
    });

    describe("user is NOT logged in", () => {
      beforeEach(() => {
        mockUseSession.mockReturnValue([null, false]);
        arrange();
      });

      it("should NOT display the modal title text", async () => {
        expect(
          screen.queryByTestId(testIDs.AuthenticationModalTitle)
        ).toBeNull();
      });
    });
  });
});
