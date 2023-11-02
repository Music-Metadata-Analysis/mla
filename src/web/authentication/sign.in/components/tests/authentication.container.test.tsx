import { render } from "@testing-library/react";
import AuthenticationSignInModalContainer from "../authentication.container";
import ModalSignInComponent from "../modals/signin/modal.signin.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import mockToggleHook from "@src/web/ui/generics/state/hooks/__mocks__/toggle.hook.mock";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/web/ui/generics/state/hooks/toggle.hook");

jest.mock("../modals/signin/modal.signin.container", () =>
  require("@fixtures/react/child").createComponent(
    "AuthenticationSignInModalContainer"
  )
);

describe("AuthenticationContainer", () => {
  let modalHidden: boolean;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<AuthenticationSignInModalContainer hidden={modalHidden} />);
  };

  const checkModalSignInComponent = () => {
    it("should call the ModalComponent with the correct props", () => {
      expect(ModalSignInComponent).toHaveBeenCalledTimes(1);
      checkMockCall(
        ModalSignInComponent,
        {
          isOpen: mockToggleHook.state,
        },
        0,
        ["handleSignIn", "onClose"]
      );
    });
  };

  describe("when the modal is NOT hidden", () => {
    beforeEach(() => {
      modalHidden = false;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        mockToggleHook.state = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        checkModalSignInComponent();

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setFalse).toHaveBeenCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        checkModalSignInComponent();

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        mockToggleHook.state = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        checkModalSignInComponent();

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setFalse).toHaveBeenCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        checkModalSignInComponent();

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setTrue).toHaveBeenCalledWith();
        });
      });
    });
  });

  describe("when the modal is hidden", () => {
    beforeEach(() => {
      modalHidden = true;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        mockToggleHook.state = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toHaveBeenCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setFalse).toHaveBeenCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toHaveBeenCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        mockToggleHook.state = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toHaveBeenCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setFalse).toHaveBeenCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toHaveBeenCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockToggleHook.setTrue).toHaveBeenCalledTimes(1);
          expect(mockToggleHook.setTrue).toHaveBeenCalledWith();
        });
      });
    });
  });
});
