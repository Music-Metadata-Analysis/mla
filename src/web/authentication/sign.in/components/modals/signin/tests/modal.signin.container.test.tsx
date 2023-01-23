import { render } from "@testing-library/react";
import { useRef } from "react";
import AuthenticationSignInModal from "../modal.signin.component";
import AuthenticationSignInModalContainer, {
  AuthenticationSignInModalContainerProps,
} from "../modal.signin.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

jest.mock("@src/web/locale/translation/hooks/translation.hook");

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
  const mockHandleSignIn = jest.fn();
  const mockT = new MockUseTranslation("authentication").t;

  const baseProps = {
    isOpen: false,
    onClose: mockOnClose,
    handleSignIn: mockHandleSignIn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<AuthenticationSignInModalContainer {...currentProps} />);
  };

  const resetProps = () => {
    jest.mocked(useTranslation).mockReturnValueOnce({ t: mockT });
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
          handleSignIn: currentProps.handleSignIn,
          isOpen: currentProps.isOpen,
          onClose: currentProps.onClose,
          scrollRef: mockRef,
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
