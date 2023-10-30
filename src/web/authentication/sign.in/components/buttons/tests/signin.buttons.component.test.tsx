import { render } from "@testing-library/react";
import SignInButtons from "../signin.buttons.component";
import authenticationTranslations from "@locales/authentication.json";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import {
  mockFacebookAuthButton,
  mockGithubAuthButton,
  mockGoogleAuthButton,
  mockLastFMAuthButton,
  mockSpotifyAuthButton,
} from "@src/vendors/integrations/auth.buttons/__mocks__/vendor.mock";
import AnalyticsButtonWrapper from "@src/web/analytics/collection/components/analytics.button/analytics.button.container";
import {
  MockUseTranslation,
  _t,
} from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import LastFMIconContainer from "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container";
import SpotifyIconContainer from "@src/web/ui/generics/components/icons/spotify/spotify.icon.container";

jest.mock("@src/vendors/integrations/auth.buttons/vendor");

jest.mock(
  "@src/web/analytics/collection/components/analytics.button/analytics.button.container",
  () =>
    require("@fixtures/react/parent").createComponent("AnalyticsButtonWrapper")
);

jest.mock(
  "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container",
  () => require("@fixtures/react/child").createComponent("LastFMIconContainer")
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
    expect(AnalyticsButtonWrapper).toBeCalledTimes(5);
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
        buttonName: "LastFM Login",
      },
      3
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Spotify Login",
      },
      4
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

  it("should call the LastFMAuthButton component correctly", () => {
    expect(mockLastFMAuthButton).toBeCalledTimes(1);
    checkMockCall(
      mockLastFMAuthButton,
      {
        width: buttonWidth,
        text: _t(authenticationTranslations.buttons.lastfm),
      },
      0,
      ["onClick", "callBack", "iconComponent"]
    );
  });

  describe("when the LastFMAuthButton's Icon is called", () => {
    beforeEach(() => {
      const icon = jest.mocked(mockLastFMAuthButton).mock.calls[0][0]
        .iconComponent as () => JSX.Element;
      icon();
    });

    it("should call the LastFMIconContainer component correctly", () => {
      expect(LastFMIconContainer).toBeCalledTimes(1);
      checkMockCall(
        LastFMIconContainer,
        {
          height: 26,
          width: 26,
        },
        0,
        ["onClick", "callBack", "iconComponent"]
      );
    });
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
