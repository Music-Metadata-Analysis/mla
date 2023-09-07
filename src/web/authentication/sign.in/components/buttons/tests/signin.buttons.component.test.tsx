import { render } from "@testing-library/react";
import SignInButtons from "../signin.buttons.component";
import authenticationTranslations from "@locales/authentication.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import {
  mockFacebookAuthButton,
  mockGithubAuthButton,
  mockGoogleAuthButton,
  mockSpotifyAuthButton,
} from "@src/vendors/integrations/auth.buttons/__mocks__/vendor.mock";
import AnalyticsButtonWrapper from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import SpotifyIconContainer from "@src/web/ui/generics/components/icons/spotify/spotify.icon.container";

jest.mock("@src/vendors/integrations/auth.buttons/vendor");

jest.mock(
  "@src/web/analytics/collection/components/analytics.button/analytics.button.container",
  () =>
    require("@fixtures/react/parent").createComponent("AnalyticsButtonWrapper")
);

describe("AuthenticationComponent", () => {
  const buttonWidth = 245;

  const mockHandleSignIn = jest.fn();
  const mockT = new MockUseTranslation("authentication").t;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<SignInButtons handleSignIn={mockHandleSignIn} t={mockT} />);
  };

  it("should call the AnalyticsWrapper component correctly", () => {
    expect(AnalyticsButtonWrapper).toBeCalledTimes(4);
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Facebook Login",
      },
      0
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Github Login",
      },
      1
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Google Login",
      },
      2
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Spotify Login",
      },
      3
    );
  });

  it("should call the FacebookAuthButton component correctly", () => {
    expect(mockFacebookAuthButton).toBeCalledTimes(1);
    checkMockCall(
      mockFacebookAuthButton,
      {
        width: buttonWidth,
        text: _t(authenticationTranslations.buttons.facebook),
      },
      0,
      ["onClick", "callBack"]
    );
  });

  it("should call the GithubAuthButton component correctly", () => {
    expect(mockGithubAuthButton).toBeCalledTimes(1);
    checkMockCall(
      mockGithubAuthButton,
      {
        width: buttonWidth,
        text: _t(authenticationTranslations.buttons.github),
      },
      0,
      ["onClick", "callBack"]
    );
  });

  it("should call the GoogleAuthButton component correctly", () => {
    expect(mockGoogleAuthButton).toBeCalledTimes(1);
    checkMockCall(
      mockGoogleAuthButton,
      {
        width: buttonWidth,
        text: _t(authenticationTranslations.buttons.google),
      },
      0,
      ["onClick", "callBack"]
    );
  });

  it("should call the SpotifyAuthButton component correctly", () => {
    expect(mockSpotifyAuthButton).toBeCalledTimes(1);
    checkMockCall(
      mockSpotifyAuthButton,
      {
        iconComponent: SpotifyIconContainer,
        width: buttonWidth,
        text: _t(authenticationTranslations.buttons.spotify),
      },
      0,
      ["onClick", "callBack"]
    );
  });
});
