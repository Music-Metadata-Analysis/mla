import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import * as authClient from "next-auth/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import translations from "../../../../public/locales/en/authentication.json";
import routes from "../../../config/routes";
import Events from "../../../events/events";
import mockAnalyticsHook from "../../../hooks/tests/analytics.mock.hook";
import mockRouter from "../../../tests/fixtures/mock.router";
import AuthenticationContainer from "../authentication.container";
import { testIDs as AuthModalTestIDs } from "../modals/modal.signin.component";
import { testIDs as SpinnerModalTestIDs } from "../modals/modal.spinner.component";

jest.mock("next-auth/react", () => ({
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

jest.mock("../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const mockUseDisclosure = jest.fn();
const mockUseSession = jest.fn();

describe("AuthenticationContainer", () => {
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const providers: (keyof typeof translations.buttons)[] = [
    "facebook",
    "github",
    "spotify",
  ];
  let mockCallBack: (() => void) | undefined;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthenticationContainer onModalClose={mockCallBack} />
      </RouterContext.Provider>
    );
  };

  const checkModal = () => {
    it("should display the modal title text", async () => {
      const title = await screen.findByTestId(
        AuthModalTestIDs.AuthenticationModalTitle
      );
      await waitFor(() => expect(title).toBeVisible());
      expect(await within(title).findByText(translations.title)).toBeTruthy();
    });

    it("should display the modal close button", async () => {
      const button = await screen.findByTestId(
        AuthModalTestIDs.AuthenticationModalCloseButton
      );
      await waitFor(() => expect(button).toBeVisible());
    });

    it("should generate an analytics event", async () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsHook.event).toBeCalledWith(Events.Auth.OpenModal);
    });
  };

  const checkModalSwitch = () => {
    it("should close the authentication modal", async () => {
      await waitFor(
        () =>
          expect(
            screen.queryByTestId(AuthModalTestIDs.AuthenticationModalTitle)
          ).toBeNull
      );
    });

    it("should open the spinner modal, and display the title", async () => {
      expect(
        await screen.findByTestId(
          SpinnerModalTestIDs.AuthenticationSpinnerModalTitle
        )
      ).toBeTruthy();
    });

    it("should open the spinner modal, and display the spinner", async () => {
      expect(
        await screen.findByTestId(
          SpinnerModalTestIDs.AuthenticationSpinnerModalSpinner
        )
      ).toBeTruthy();
    });
  };

  const checkLoginButtons = () => {
    providers.map((provider) => {
      describe(`when the ${provider} button is clicked`, () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          const button = await screen.findByText(
            translations.buttons[provider]
          );
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should start the sign-in sequence", () => {
          expect(authClient.signIn).toBeCalledWith(provider);
        });

        it("should generate an analytics event", () => {
          expect(mockAnalyticsHook.event).toBeCalledTimes(1);
          expect(mockAnalyticsHook.event).toBeCalledWith(
            Events.Auth.HandleLogin(provider)
          );
        });

        checkModalSwitch();
      });
    });
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
        mockUseSession.mockReturnValue({ data: {}, status: "authenticated" });
      });

      describe("when a callback is specified", () => {
        beforeEach(() => {
          mockCallBack = jest.fn();
          arrange();
        });

        checkModal();
        checkLoginButtons();

        describe("when the terms of service link is clicked", () => {
          beforeEach(async () => {
            const footer = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalFooter
            );
            const link = await within(footer).findByText(translations.terms);
            fireEvent.click(link);
          });

          it("should close the modal", () => {
            expect(mockOnClose).toBeCalledTimes(1);
            expect(mockOnClose).toBeCalledWith();
          });

          it("should route the the correct url", () => {
            expect(mockRouter.push).toBeCalledTimes(1);
            expect(mockRouter.push).toBeCalledWith(
              routes.legal.terms,
              routes.legal.terms,
              {
                locale: undefined,
                scroll: undefined,
                shallow: undefined,
              }
            );
          });
        });

        describe("when the close button is clicked", () => {
          beforeEach(async () => {
            const button = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalCloseButton
            );
            await waitFor(() => expect(button).toBeVisible());
            fireEvent.click(button);
          });

          it("should call the callBack function", () => {
            expect(mockCallBack).toBeCalledTimes(1);
            expect(mockCallBack).toBeCalledWith();
          });

          it("should NOT route back", () => {
            expect(mockRouter.back).toBeCalledTimes(0);
          });
        });
      });

      describe("when a callback is NOT specified", () => {
        beforeEach(() => {
          mockCallBack = undefined;
          arrange();
        });

        checkModal();
        checkLoginButtons();

        describe("when the modal close button is clicked", () => {
          beforeEach(async () => {
            jest.clearAllMocks();
            const button = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalCloseButton
            );
            await waitFor(() => expect(button).toBeVisible());
            fireEvent.click(button);
          });

          it("should NOT call the callBack function", () => {
            expect(mockCallBack).toBe(undefined);
          });

          it("should route to the correct url", () => {
            expect(mockRouter.back).toBeCalledTimes(1);
            expect(mockRouter.back).toBeCalledWith();
          });

          it("should generate an analytics event", () => {
            expect(mockAnalyticsHook.event).toBeCalledTimes(1);
            expect(mockAnalyticsHook.event).toBeCalledWith(
              Events.Auth.CloseModal
            );
          });
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
        mockUseSession.mockReturnValue({
          data: null,
          status: "unauthenticated",
        });
        arrange();
      });

      it("should NOT display the modal title text", async () => {
        expect(
          screen.queryByTestId(AuthModalTestIDs.AuthenticationModalTitle)
        ).toBeNull();
      });
    });
  });
});
