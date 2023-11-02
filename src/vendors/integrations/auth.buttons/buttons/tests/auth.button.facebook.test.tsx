import { fireEvent, render, screen } from "@testing-library/react";
import { FacebookLoginButton } from "react-social-login-buttons";
import FacebookAuthButton from "../auth.button.facebook";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("react-social-login-buttons", () =>
  require("@fixtures/react/parent").createComponent(
    "FacebookLoginButton",
    "FacebookLoginButton"
  )
);

describe("FacebookAuthButton", () => {
  const buttonWidth = 245;
  const mockCallBack = jest.fn();
  const mockText = "Button Text";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <FacebookAuthButton
        callBack={mockCallBack}
        text={mockText}
        width={buttonWidth}
      />
    );
  };

  it("should call the underlying FacebookLoginButton with the correct props", () => {
    expect(FacebookLoginButton).toHaveBeenCalledTimes(1);
    checkMockCall(FacebookLoginButton, {
      align: "center",
      style: { width: `${buttonWidth}px` },
      text: mockText,
    });
  });

  describe("when clicked", () => {
    beforeEach(async () =>
      fireEvent.click(await screen.findByTestId("FacebookLoginButton"))
    );

    it("should call the callBack as expected", () => {
      expect(mockCallBack).toHaveBeenCalledTimes(1);
      expect(mockCallBack).toHaveBeenCalledWith("facebook");
    });
  });
});
