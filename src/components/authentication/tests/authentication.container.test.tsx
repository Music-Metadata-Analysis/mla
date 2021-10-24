import { render } from "@testing-library/react";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import AuthenticationContainer from "../authentication.container";
import ModalSignInComponent from "../modals/modal.signin.component";

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  useDisclosure: () => mockUseDisclosure(),
}));

jest.mock("../modals/modal.signin.component", () => {
  return jest.fn(() => <div>MockComponent</div>);
});

const mockUseDisclosure = jest.fn();
const mockUseSession = jest.fn();

describe("AuthenticationContainer", () => {
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const ModalComponentFunctionProps = [
    "signIn",
    "onOpen",
    "onClose",
    "setClicked",
  ];

  beforeEach(() => jest.clearAllMocks());

  const arrange = (hidden = false) => {
    render(<AuthenticationContainer hidden={hidden} />);
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
        mockUseSession.mockReturnValue({
          data: null,
          status: "unauthenticated",
        });
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
      mockUseDisclosure.mockReturnValue({
        isOpen: false,
        onOpen: mockOnOpen,
        onClose: mockOnClose,
      });
    });

    describe("user is logged in", () => {
      beforeEach(() => {
        mockUseSession.mockReturnValue({ data: {}, status: "authenticated" });
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
        mockUseSession.mockReturnValue({
          data: null,
          status: "unauthenticated",
        });
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

  describe("modal is hidden", () => {
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
        arrange(true);
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
        mockUseSession.mockReturnValue({
          data: null,
          status: "unauthenticated",
        });
        arrange(true);
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
});
