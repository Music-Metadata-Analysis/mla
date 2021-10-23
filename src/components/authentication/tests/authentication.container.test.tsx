import { render } from "@testing-library/react";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import AuthenticationComponent from "../authentication.component";
import AuthenticationContainer from "../authentication.container";

jest.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  useDisclosure: () => mockUseDisclosure(),
}));

jest.mock("../authentication.component", () => {
  return jest.fn(() => <div>MockComponent</div>);
});

const mockUseDisclosure = jest.fn();
const mockUseSession = jest.fn();

describe("AuthenticationContainer", () => {
  const mockOnOpen = jest.fn();
  const mockOnClose = jest.fn();
  const authenticationComponentFunctionProps = ["signIn", "onOpen", "onClose"];

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<AuthenticationContainer />);
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

      it("should call the AuthenticationComponent with the correct props", () => {
        expect(AuthenticationComponent).toBeCalledTimes(1);
        checkMockCall(
          AuthenticationComponent,
          {
            isOpen: true,
          },
          0,
          ["signIn", "onOpen", "onClose"]
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

      it("should call the AuthenticationComponent with the correct props", () => {
        expect(AuthenticationComponent).toBeCalledTimes(1);
        checkMockCall(
          AuthenticationComponent,
          {
            isOpen: true,
          },
          0,
          authenticationComponentFunctionProps
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

      it("should call the AuthenticationComponent with the correct props", () => {
        expect(AuthenticationComponent).toBeCalledTimes(1);
        checkMockCall(
          AuthenticationComponent,
          {
            isOpen: false,
          },
          0,
          authenticationComponentFunctionProps
        );
      });

      it("should NOT close the modal on render", () => {
        expect(mockOnClose).toBeCalledTimes(0);
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

      it("should call the AuthenticationComponent with the correct props", () => {
        expect(AuthenticationComponent).toBeCalledTimes(1);
        checkMockCall(
          AuthenticationComponent,
          {
            isOpen: false,
          },
          0,
          authenticationComponentFunctionProps
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
