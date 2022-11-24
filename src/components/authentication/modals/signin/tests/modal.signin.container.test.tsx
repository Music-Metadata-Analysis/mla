import { render } from "@testing-library/react";
import { useRef } from "react";
import AuthenticationSignInModal from "../modal.signin.component";
import AuthenticationSignInModalContainer, {
  AuthenticationSignInModalContainerProps,
} from "../modal.signin.container";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import useLocale from "@src/hooks/locale";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/locale");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("../modal.signin.component", () =>
  require("@fixtures/react/child").createComponent("AuthenticationSignInModal")
);

describe("AuthenticationSignInModalContainer", () => {
  let currentProps: AuthenticationSignInModalContainerProps;

  const mockOnClose = jest.fn();
  const mockRef = { current: null, value: "mocked" };
  const mockSetClicked = jest.fn();
  const mockSignIn = jest.fn();
  const mockT = new MockUseLocale("authentication").t;

  const baseProps = {
    isOpen: false,
    onClose: mockOnClose,
    setClicked: mockSetClicked,
    signIn: mockSignIn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<AuthenticationSignInModalContainer {...currentProps} />);
  };

  const resetProps = () => {
    jest.mocked(useLocale).mockReturnValueOnce({ t: mockT });
    jest.mocked(useRef).mockReturnValueOnce(mockRef);
    currentProps = { ...baseProps };
  };

  const checkAuthenticationSignInModalComponent = () => {
    it("should render the AuthenticationSignInModal as expected", () => {
      expect(AuthenticationSignInModal).toBeCalledTimes(1);
      checkMockCall(
        AuthenticationSignInModal,
        {
          authenticationT: mockT,
          isOpen: currentProps.isOpen,
          onClose: currentProps.onClose,
          scrollRef: mockRef,
          setClicked: currentProps.setClicked,
          signIn: currentProps.signIn,
          termsText: mockT("terms"),
          titleText: mockT("title"),
        },
        0
      );
    });
  };

  describe("when the modal is open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;

      arrange();
    });

    checkAuthenticationSignInModalComponent();
  });

  describe("when the modal is closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;

      arrange();
    });

    checkAuthenticationSignInModalComponent();
  });
});