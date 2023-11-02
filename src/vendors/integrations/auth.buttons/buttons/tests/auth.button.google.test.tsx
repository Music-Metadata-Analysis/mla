import { fireEvent, render, screen } from "@testing-library/react";
import { GoogleLoginButton } from "react-social-login-buttons";
import GoogleAuthButton from "../auth.button.google";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("react-social-login-buttons", () =>
  require("@fixtures/react/parent").createComponent(
    "GoogleLoginButton",
    "GoogleLoginButton"
  )
);

describe("GoogleAuthButton", () => {
  const buttonWidth = 245;
  const mockCallBack = jest.fn();
  const mockText = "Button Text";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <GoogleAuthButton
        callBack={mockCallBack}
        text={mockText}
        width={buttonWidth}
      />
    );
  };

  it("should call the underlying GoogleLoginButton with the correct props", () => {
    expect(GoogleLoginButton).toHaveBeenCalledTimes(1);
    checkMockCall(GoogleLoginButton, {
      align: "center",
      style: { width: `${buttonWidth}px` },
      text: mockText,
    });
  });

  describe("when clicked", () => {
    beforeEach(async () =>
      fireEvent.click(await screen.findByTestId("GoogleLoginButton"))
    );

    it("should call the callBack as expected", () => {
      expect(mockCallBack).toHaveBeenCalledTimes(1);
      expect(mockCallBack).toHaveBeenCalledWith("google");
    });
  });
});
