import {
  Box,
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
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import translations from "../../../../public/locales/en/authentication.json";
import mockColourHook from "../../../hooks/tests/colour.hook.mock";
import checkMockCall from "../../../tests/fixtures/mock.component.call";
import AuthenticationComponent, { testIDs } from "../authentication.component";

jest.mock("@chakra-ui/react", () => {
  const {
    factoryInstance,
  } = require("../../../tests/fixtures/mock.chakra.react.factory.class");
  const instance = factoryInstance.create([
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
  return instance;
});

jest.mock("react-social-login-buttons", () => ({
  FacebookLoginButton: jest.fn(() => "FacebookLoginButton"),
  GithubLoginButton: jest.fn(() => "GithubLoginButton"),
  GoogleLoginButton: jest.fn(() => "GoogleLoginButton"),
}));

jest.mock("../../../hooks/colour", () => {
  return () => mockColourHook;
});

const mockOnClose = jest.fn();
const mockSignIn = jest.fn();

describe("AuthenticationComponent", () => {
  const buttonWidth = 250;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange(true);
  });

  const arrange = (isOpen: boolean) => {
    render(
      <AuthenticationComponent
        isOpen={isOpen}
        signIn={mockSignIn}
        onClose={mockOnClose}
      />
    );
  };

  it("should call the Box component correctly", () => {
    expect(Box).toBeCalledTimes(1);
    checkMockCall(Box, {
      borderWidth: 1,
    });
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
      color: mockColourHook.modalColour.foreground,
      borderColor: mockColourHook.modalColour.border,
      bg: mockColourHook.modalColour.background,
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
    checkMockCall(ModalBody, {});
  });

  it("should call the Center component correctly", () => {
    expect(Center).toBeCalledTimes(1);
    checkMockCall(Center, {});
  });

  it("should call the Flex component correctly", () => {
    expect(Flex).toBeCalledTimes(1);
    checkMockCall(Flex, {
      "data-testid": testIDs.AuthenticationLoginButtons,
      direction: "column",
    });
  });

  it("should call the FacebookLoginButton component correctly", () => {
    expect(FacebookLoginButton).toBeCalledTimes(1);
    checkMockCall(
      FacebookLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: translations.buttons.facebook,
      },
      0,
      ["onClick"]
    );
  });

  it("should call the FacebookLoginButton component correctly", () => {
    expect(GithubLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GithubLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: translations.buttons.github,
      },
      0,
      ["onClick"]
    );
  });

  it("should call the FacebookLoginButton component correctly", () => {
    expect(GoogleLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GoogleLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: translations.buttons.google,
      },
      0,
      ["onClick"]
    );
  });

  it("should call the ModalFooter component correctly", () => {
    expect(ModalFooter).toBeCalledTimes(1);
    checkMockCall(ModalFooter, {});
  });
});
