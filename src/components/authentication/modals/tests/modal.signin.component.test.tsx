import {
  // @ts-ignore: mocked with forwardRef
  BoxWithFwdRef,
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
import SignInButtons from "../../buttons/signin.buttons";
import ModalComponent, { testIDs } from "../modal.signin.component";
import ClickLink from "@src/components/clickable/click.link.internal/click.link.internal.component";
import VerticalScrollBar from "@src/components/scrollbar/vertical.scrollbar.component";
import routes from "@src/config/routes";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import { mockUseLocale } from "@src/hooks/tests/locale.mock.hook";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { forwardRef } = require("react");
  const { createChakraMock } = require("@fixtures/chakra");
  const instance = createChakraMock([
    "Box",
    "Center",
    "Container",
    "Flex",
    "Modal",
    "ModalContent",
    "ModalHeader",
    "ModalFooter",
    "ModalBody",
  ]);
  instance.ModalOverlay = jest.fn(() => "ModalOverlay");
  instance.ModalCloseButton = jest.fn(() => "ModalCloseButton");
  instance.BoxWithFwdRef = instance.Box;
  instance.Box = forwardRef(instance.Box);
  return instance;
});

jest.mock("../../buttons/signin.buttons", () =>
  jest.fn(() => <div>MockSignInButtons</div>)
);

jest.mock("@src/components/scrollbar/vertical.scrollbar.component", () =>
  jest.fn(() => <div>MockVerticalScrollBar</div>)
);

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock(
  "@src/hooks/locale",
  () => (filename: string) => new mockUseLocale(filename)
);

jest.mock(
  "@src/components/clickable/click.link.internal/click.link.internal.component",
  () => require("@fixtures/react").createComponent("ClickLink")
);

const mockOnClose = jest.fn();
const mockSignIn = jest.fn();
const mockSetClicked = jest.fn();

describe("AuthenticationModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    arrange(true);
  });

  const arrange = (isOpen: boolean) => {
    render(
      <ModalComponent
        isOpen={isOpen}
        signIn={mockSignIn}
        setClicked={mockSetClicked}
        onClose={mockOnClose}
      />
    );
  };

  it("should call the Box component correctly", () => {
    expect(BoxWithFwdRef).toBeCalledTimes(2);
    checkMockCall(
      BoxWithFwdRef,
      {
        borderWidth: 1,
      },
      0
    );
    checkMockCall(
      BoxWithFwdRef,
      {
        className: "scrollbar",
        id: "SignInProvidersScrollArea",
        maxHeight: "calc(100vh - 150px)",
      },
      1
    );
  });

  it("should call the Modal component correctly", () => {
    expect(Modal).toBeCalledTimes(1);
    checkMockCall(Modal, {
      isCentered: true,
      isOpen: true,
      onClose: mockOnClose,
      closeOnOverlayClick: false,
    });
  });

  it("should call the ModalOverlay component correctly", () => {
    expect(ModalOverlay).toBeCalledTimes(1);
    checkMockCall(ModalOverlay, {});
  });

  it("should call the ModalContent component correctly", () => {
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

  it("should call the Container component correctly", () => {
    expect(Container).toBeCalledTimes(1);
    checkMockCall(Container, {
      centerContent: true,
    });
  });

  it("should call the ModalCloseButton component correctly", () => {
    expect(ModalCloseButton).toBeCalledTimes(1);
    checkMockCall(ModalCloseButton, {
      "data-testid": testIDs.AuthenticationModalCloseButton,
      sx: {
        boxShadow: "none !important",
      },
    });
  });

  it("should call the ModalHeader component correctly", () => {
    expect(ModalHeader).toBeCalledTimes(1);
    checkMockCall(ModalHeader, {
      "data-testid": testIDs.AuthenticationModalTitle,
    });
  });

  it("should call the ModalBody component correctly", () => {
    expect(ModalBody).toBeCalledTimes(1);
    checkMockCall(ModalBody, {
      pl: 2,
      pr: 2,
    });
  });

  it("should call the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, {});
  });

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

  it("should call the VerticalScrollBar component correctly", () => {
    expect(VerticalScrollBar).toBeCalledTimes(1);
    const call = (VerticalScrollBar as jest.Mock).mock.calls[0][0];
    expect(call.scrollRef).toBeDefined();
    expect(call.update).toBe(null);
    expect(call.horizontalOffset).toBe(10);
    expect(call.verticalOffset).toBe(0);
    expect(call.zIndex).toBe(10000);
    expect(Object.keys(call).length).toBe(5);
  });

  it("should call the SignInButtons component correctly", () => {
    expect(SignInButtons).toBeCalledTimes(1);
    const call = (SignInButtons as jest.Mock).mock.calls[0][0];
    expect(call.signIn).toBe(mockSignIn);
    expect(call.setClicked).toBe(mockSetClicked);
    expect(typeof call.t).toBe("function");
    expect(Object.keys(call).length).toBe(3);
  });

  it("should call the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });

  it("should call the ClickLink component correctly", () => {
    expect(ClickLink).toBeCalledTimes(1);
    checkMockCall(ClickLink, {
      href: routes.legal.terms,
    });
  });
});
