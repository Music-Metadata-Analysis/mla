import { render } from "@testing-library/react";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import checkMockCall from "../../../../tests/fixtures/mock.component.call";
import AnalyticsWrapper from "../../../analytics/analytics.button/analytics.button.component";
import SpotifyLoginButton from "../../../button/button.spotify/spotify.login";
import SignInButtons from "../signin.buttons";

jest.mock("react-social-login-buttons", () => ({
  FacebookLoginButton: jest.fn(() => "FacebookLoginButton"),
  GithubLoginButton: jest.fn(() => "GithubLoginButton"),
  GoogleLoginButton: jest.fn(() => "GoogleLoginButton"),
}));

jest.mock("../../../button/button.spotify/spotify.login", () =>
  jest.fn(() => "SpotifyLoginButton")
);

jest.mock(
  "../../../analytics/analytics.button/analytics.button.component",
  () => createMockedComponent("AnalyticsWrapper")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../../../../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

const mockSetClicked = jest.fn();
const mockSignIn = jest.fn();
const mockT = jest.fn((arg: string) => `t(${arg})`);

describe("AuthenticationComponent", () => {
  const buttonWidth = 245;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(
      <SignInButtons
        setClicked={mockSetClicked}
        signIn={mockSignIn}
        t={mockT}
      />
    );
  };

  it("should call the AnalyticsWrapper component correctly", () => {
    expect(AnalyticsWrapper).toBeCalledTimes(4);
    checkMockCall(
      AnalyticsWrapper,
      {
        buttonName: "Facebook Login",
      },
      0
    );
    checkMockCall(
      AnalyticsWrapper,
      {
        buttonName: "Github Login",
      },
      1
    );
    checkMockCall(
      AnalyticsWrapper,
      {
        buttonName: "Google Login",
      },
      2
    );
    checkMockCall(
      AnalyticsWrapper,
      {
        buttonName: "Spotify Login",
      },
      3
    );
  });

  it("should call the FacebookLoginButton component correctly", () => {
    expect(FacebookLoginButton).toBeCalledTimes(1);
    checkMockCall(
      FacebookLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: "t(buttons.facebook)",
      },
      0,
      ["onClick"]
    );
  });

  it("should call the GithubLoginButton component correctly", () => {
    expect(GithubLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GithubLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: "t(buttons.github)",
      },
      0,
      ["onClick"]
    );
  });

  it("should call the GoogleLoginButton component correctly", () => {
    expect(GoogleLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GoogleLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: "t(buttons.google)",
      },
      0,
      ["onClick"]
    );
  });

  it("should call the SpotifyLoginButton component correctly", () => {
    expect(SpotifyLoginButton).toBeCalledTimes(1);
    checkMockCall(
      SpotifyLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: "t(buttons.spotify)",
      },
      0,
      ["onClick"]
    );
  });
});
