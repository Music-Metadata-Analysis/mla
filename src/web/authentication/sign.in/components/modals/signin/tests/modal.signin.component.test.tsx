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
import ClickLinkInternalContainer from "@src/components/clickable/click.link.internal/click.link.internal.container";
import VerticalScrollBarContainer from "@src/components/scrollbars/vertical/vertical.scrollbar.container";
import routes from "@src/config/routes";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";
import SignInButtons from "@src/web/authentication/sign.in/components/buttons/signin.buttons.component";
import { MockUseTranslation } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

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
  "@src/components/scrollbars/vertical/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

jest.mock(
  "@src/components/clickable/click.link.internal/click.link.internal.container",
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
      expect(Modal).toBeCalledTimes(1);
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
      expect(ModalOverlay).toBeCalledTimes(1);
      checkMockCall(ModalOverlay, {});
    });
  };

  const checkNoChakraModalOverlayContentComponentRender = () => {
    it("should NOT render the ModalOverlay component", () => {
      expect(ModalOverlay).toBeCalledTimes(0);
    });
  };

  const checkChakraModalContentComponentRender = () => {
    it("should render the ModalContent component correctly", () => {
      expect(ModalContent).toBeCalledTimes(1);
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
      expect(ModalContent).toBeCalledTimes(0);
    });
  };

  const checkChakraContainerComponentRender = () => {
    it("should render the Container component correctly", () => {
      expect(Container).toBeCalledTimes(1);
      checkMockCall(Container, {
        centerContent: true,
      });
    });
  };

  const checkChakraModalCloseButtonComponentRender = () => {
    it("should render the ModalCloseButton component correctly", () => {
      expect(ModalCloseButton).toBeCalledTimes(1);
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
      expect(ModalHeader).toBeCalledTimes(1);
      checkMockCall(ModalHeader, {
        "data-testid": testIDs.AuthenticationModalTitle,
      });
    });
  };

  const checkChakraModalBodyComponentRender = () => {
    it("should call the ModalBody component correctly", () => {
      expect(ModalBody).toBeCalledTimes(1);
      checkMockCall(ModalBody, {
        pl: 2,
        pr: 2,
      });
    });
  };

  const checkChakraCenterComponentRender = () => {
    it("should call the Center component correctly", () => {
      expect(Center).toBeCalledTimes(1);
      checkMockCall(Center, {});
    });
  };

  const checkChakraBoxComponentRender = () => {
    it("should render the Box component correctly", () => {
      expect(BoxWithRef).toBeCalledTimes(2);
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
      expect(Flex).toBeCalledTimes(2);
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
      expect(VerticalScrollBarContainer).toBeCalledTimes(1);
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
      expect(SignInButtons).toBeCalledTimes(1);
      const call = jest.mocked(SignInButtons).mock.calls[0][0];
      expect(call.handleSignIn).toBe(mockHandleSignIn);
      expect(typeof call.t).toBe("function");
      expect(Object.keys(call).length).toBe(2);
    });
  };

  const checkModalFooterComponentRender = () => {
    it("should call the ModalFooter component correctly", () => {
      expect(ModalFooter).toBeCalledTimes(1);
      checkMockCall(ModalFooter, {});
    });
  };

  const checkClickLinkInternalContainerRender = () => {
    it("should call the ClickLinkInternalContainer component correctly", () => {
      expect(ClickLinkInternalContainer).toBeCalledTimes(1);
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
