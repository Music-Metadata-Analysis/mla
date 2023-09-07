import { fireEvent, render, screen } from "@testing-library/react";
import { GithubLoginButton } from "react-social-login-buttons";
import GithubAuthButton from "../auth.button.github";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock("react-social-login-buttons", () =>
  require("@fixtures/react/parent").createComponent(
    "GithubLoginButton",
    "GithubLoginButton"
  )
);

describe("GithubAuthButton", () => {
  const buttonWidth = 245;
  const mockCallBack = jest.fn();
  const mockText = "Button Text";

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <GithubAuthButton
        callBack={mockCallBack}
        text={mockText}
        width={buttonWidth}
      />
    );
  };

  it("should call the underlying GithubLoginButton with the correct props", () => {
    expect(GithubLoginButton).toBeCalledTimes(1);
    checkMockCall(GithubLoginButton, {
      align: "center",
      style: { width: `${buttonWidth}px` },
      text: mockText,
    });
  });

  describe("when clicked", () => {
    beforeEach(async () =>
      fireEvent.click(await screen.findByTestId("GithubLoginButton"))
    );

    it("should call the callBack as expected", () => {
      expect(mockCallBack).toBeCalledTimes(1);
      expect(mockCallBack).toBeCalledWith("github");
    });
  });
});
