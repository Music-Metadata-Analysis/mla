import { render } from "@testing-library/react";
import AuthenticationContainer from "../authentication.container";
import ModalSignInComponent from "../modals/modal.signin.component";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/auth", () => () => mockAuthHook);

jest.mock("../modals/modal.signin.component", () => {
  return jest.fn(() => <div>MockComponent</div>);
});

jest.mock("@chakra-ui/react", () => ({
  useDisclosure: () => mockUseDisclosure(),
}));

const mockUseDisclosure = jest.fn();

describe("AuthenticationContainer", () => {
  let modalHidden: boolean;
  let modalOpen: boolean;
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();

  const ModalComponentFunctionProps = [
    "signIn",
    "onOpen",
    "onClose",
    "setClicked",
  ];

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    mockUseDisclosure.mockReturnValue({
      isOpen: modalOpen,
      onOpen: mockOnOpen,
      onClose: mockOnClose,
    });

    render(<AuthenticationContainer hidden={modalHidden} />);
  };

  describe("when the modal is NOT hidden", () => {
    beforeEach(() => {
      modalHidden = false;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        modalOpen = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should call the ModalComponent with the correct props", () => {
          expect(ModalSignInComponent).toBeCalledTimes(1);
          checkMockCall(
            ModalSignInComponent,
            {
              isOpen: true,
            },
            0,
            ModalComponentFunctionProps
          );
        });

        it("should close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(1);
          expect(mockOnClose).toBeCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should call the ModalComponent with the correct props", () => {
          expect(ModalSignInComponent).toBeCalledTimes(1);
          checkMockCall(
            ModalSignInComponent,
            {
              isOpen: true,
            },
            0,
            ModalComponentFunctionProps
          );
        });

        it("should NOT close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        modalOpen = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should call the ModalComponent with the correct props", () => {
          expect(ModalSignInComponent).toBeCalledTimes(1);
          checkMockCall(
            ModalSignInComponent,
            {
              isOpen: false,
            },
            0,
            ModalComponentFunctionProps
          );
        });

        it("should close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(1);
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should call the ModalComponent with the correct props", () => {
          expect(ModalSignInComponent).toBeCalledTimes(1);
          checkMockCall(
            ModalSignInComponent,
            {
              isOpen: false,
            },
            0,
            ModalComponentFunctionProps
          );
        });

        it("should NOT close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(1);
          expect(mockOnOpen).toBeCalledWith();
        });
      });
    });
  });

  describe("modal is hidden", () => {
    beforeEach(() => {
      modalHidden = true;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        modalOpen = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(1);
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        modalOpen = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(1);
        });

        it("should NOT open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockOnClose).toBeCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockOnOpen).toBeCalledTimes(1);
          expect(mockOnOpen).toBeCalledWith();
        });
      });
    });
  });
});
