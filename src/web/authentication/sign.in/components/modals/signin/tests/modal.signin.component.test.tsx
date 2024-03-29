import {
  // @ts-ignore: mocked with forwardRef
  BoxWithRef,
  Center,
  Container,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { render } from "@testing-library/react";
import AuthenticationSignInComponent, {
  AuthenticationSignInModalProps,
} from "../modal.signin.component";
import { testIDs, ids } from "../modal.signin.identifiers";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import SignInButtons from "@src/web/authentication/sign.in/components/buttons/signin.buttons.component";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import ClickLinkInternalContainer from "@src/web/navigation/links/components/click.link.internal/click.link.internal.container";
import mockColourHook from "@src/web/ui/colours/state/hooks/__mocks__/colour.hook.mock";
import VerticalScrollBarContainer from "@src/web/ui/scrollbars/vertical/components/vertical.scrollbar.container";

jest.mock("@src/web/ui/colours/state/hooks/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(
    [
      "Center",
      "Container",
      "Flex",
      "Modal",
      "ModalBody",
      "ModalCloseButton",
      "ModalContent",
      "ModalFooter",
      "ModalHeader",
      "ModalOverlay",
    ],
    ["Box"]
  )
);

jest.mock(
  "@src/web/authentication/sign.in/components/buttons/signin.buttons.component",
  () => require("@fixtures/react/child").createComponent("SignInButtons")
);

jest.mock(
  "@src/web/ui/scrollbars/vertical/components/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

jest.mock(
  "@src/web/navigation/links/components/click.link.internal/click.link.internal.container",
  () => require("@fixtures/react/parent").createComponent("ClickLink")
);

describe("AuthenticationModal", () => {
  let currentProps: AuthenticationSignInModalProps;

  const mockHandleSignIn = jest.fn();
  const mockOnClose = jest.fn();
  const mockRef = { current: null, value: "mocked" };
  const mockT = new MockUseTranslation("authentication").t;

  const baseProps: AuthenticationSignInModalProps = {
    authenticationT: mockT,
    handleSignIn: mockHandleSignIn,
    isOpen: true,
    onClose: mockOnClose,
    scrollRef: mockRef,
    termsText: "mockTermsText",
    titleText: "mockTitleText",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<AuthenticationSignInComponent {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkChakraModalComponentRender = () => {
    it("should render the Modal component correctly", () => {
      expect(Modal).toHaveBeenCalledTimes(1);
      checkMockCall(Modal, {
        isCentered: true,
        isOpen: currentProps.isOpen,
        onClose: currentProps.onClose,
        closeOnOverlayClick: false,
      });
    });
  };

  const checkChakraModalOverlayComponentRender = () => {
    it("should render the ModalOverlay component correctly", () => {
      expect(ModalOverlay).toHaveBeenCalledTimes(1);
      checkMockCall(ModalOverlay, {});
    });
  };

  const checkNoChakraModalOverlayContentComponentRender = () => {
    it("should NOT render the ModalOverlay component", () => {
      expect(ModalOverlay).toHaveBeenCalledTimes(0);
    });
  };

  const checkChakraModalContentComponentRender = () => {
    it("should render the ModalContent component correctly", () => {
      expect(ModalContent).toHaveBeenCalledTimes(1);
      checkMockCall(ModalContent, {
        bg: mockColourHook.modalColour.background,
        borderColor: mockColourHook.modalColour.border,
        color: mockColourHook.modalColour.foreground,
        m: 0,
        ml: 2,
        mr: 2,
      });
    });
  };

  const checkNoChakraModalContentComponentRender = () => {
    it("should NOT render the ModalContent component", () => {
      expect(ModalContent).toHaveBeenCalledTimes(0);
    });
  };

  const checkChakraContainerComponentRender = () => {
    it("should render the Container component correctly", () => {
      expect(Container).toHaveBeenCalledTimes(1);
      checkMockCall(Container, {
        centerContent: true,
      });
    });
  };

  const checkChakraModalCloseButtonComponentRender = () => {
    it("should render the ModalCloseButton component correctly", () => {
      expect(ModalCloseButton).toHaveBeenCalledTimes(1);
      checkMockCall(ModalCloseButton, {
        "data-testid": testIDs.AuthenticationModalCloseButton,
        sx: {
          boxShadow: "none !important",
        },
      });
    });
  };

  const checkChakraModalHeaderComponentRender = () => {
    it("should render the ModalHeader component correctly", () => {
      expect(ModalHeader).toHaveBeenCalledTimes(1);
      checkMockCall(ModalHeader, {
        "data-testid": testIDs.AuthenticationModalTitle,
      });
    });
  };

  const checkChakraModalBodyComponentRender = () => {
    it("should call the ModalBody component correctly", () => {
      expect(ModalBody).toHaveBeenCalledTimes(1);
      checkMockCall(ModalBody, {
        pl: 2,
        pr: 2,
      });
    });
  };

  const checkChakraCenterComponentRender = () => {
    it("should call the Center component correctly", () => {
      expect(Center).toHaveBeenCalledTimes(1);
      checkMockCall(Center, {});
    });
  };

  const checkChakraBoxComponentRender = () => {
    it("should render the Box component correctly", () => {
      expect(BoxWithRef).toHaveBeenCalledTimes(2);
      checkMockCall(
        BoxWithRef,
        {
          borderWidth: 1,
        },
        0
      );
      checkMockCall(
        BoxWithRef,
        {
          className: "scrollbar",
          id: ids.SignInProvidersScrollArea,
          maxHeight: "calc(100vh - 150px)",
        },
        1
      );
    });
  };

  const checkChakraFlexComponentRender = () => {
    it("should call the Flex component correctly", () => {
      expect(Flex).toHaveBeenCalledTimes(2);
      checkMockCall(
        Flex,
        {
          "data-testid": testIDs.AuthenticationLoginButtons,
          direction: "column",
        },
        0
      );
      checkMockCall(
        Flex,
        {
          "data-testid": testIDs.AuthenticationModalFooter,
          textDecoration: "underline",
          justify: "center",
          align: "center",
          w: "100%",
        },
        1,
        ["onClick"]
      );
    });
  };

  const checkVerticalScrollBarComponentRender = () => {
    it("should call the VerticalScrollBar component correctly", () => {
      expect(VerticalScrollBarContainer).toHaveBeenCalledTimes(1);
      const call = jest.mocked(VerticalScrollBarContainer).mock.calls[0][0];
      expect(call.scrollRef).toBeDefined();
      expect(call.update).toBe(null);
      expect(call.horizontalOffset).toBe(10);
      expect(call.verticalOffset).toBe(0);
      expect(call.zIndex).toBe(10000);
      expect(Object.keys(call).length).toBe(5);
    });
  };

  const checkSignInButtonsComponentRender = () => {
    it("should call the SignInButtons component correctly", () => {
      expect(SignInButtons).toHaveBeenCalledTimes(1);
      const call = jest.mocked(SignInButtons).mock.calls[0][0];
      expect(call.handleSignIn).toBe(mockHandleSignIn);
      expect(typeof call.t).toBe("function");
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const checkModalFooterComponentRender = () => {
    it("should call the ModalFooter component correctly", () => {
      expect(ModalFooter).toHaveBeenCalledTimes(1);
      checkMockCall(ModalFooter, {});
    });
  };

  const checkClickLinkInternalContainerRender = () => {
    it("should call the ClickLinkInternalContainer component correctly", () => {
      expect(ClickLinkInternalContainer).toHaveBeenCalledTimes(1);
      checkMockCall(ClickLinkInternalContainer, {
        path: routes.legal.terms,
      });
    });
  };

  describe("when the modal is open", () => {
    beforeEach(() => {
      currentProps.isOpen = true;

      arrange();
    });

    checkChakraModalComponentRender();
    checkChakraModalOverlayComponentRender();
    checkChakraModalContentComponentRender();
    checkChakraModalCloseButtonComponentRender();
    checkChakraBoxComponentRender();
    checkChakraContainerComponentRender();
    checkChakraModalHeaderComponentRender();
    checkChakraModalBodyComponentRender();
    checkChakraCenterComponentRender();
    checkVerticalScrollBarComponentRender();
    checkChakraFlexComponentRender();
    checkSignInButtonsComponentRender();
    checkModalFooterComponentRender();
    checkClickLinkInternalContainerRender();
  });

  describe("when the modal is closed", () => {
    beforeEach(() => {
      currentProps.isOpen = false;

      arrange();
    });

    checkChakraModalComponentRender();
    checkNoChakraModalOverlayContentComponentRender();
    checkNoChakraModalContentComponentRender();
  });
});
