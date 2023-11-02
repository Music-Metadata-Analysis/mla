import { Avatar } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
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

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Avatar"]);
});

jest.mock(
  "@src/web/analytics/collection/components/analytics.button/analytics.button.container",
  () =>
    require("@fixtures/react/parent").createComponent("AnalyticsButtonWrapper")
);

jest.mock(
  "@src/web/ui/generics/components/icons/lastfm/lastfm.icon.container",
  () => require("@fixtures/react/child").createComponent("LastFMIconContainer")
);

jest.mock("@src/vendors/integrations/web.framework/vendor");

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
    expect(AnalyticsButtonWrapper).toHaveBeenCalledTimes(5);
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
    expect(mockFacebookAuthButton).toHaveBeenCalledTimes(1);
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
    expect(mockGithubAuthButton).toHaveBeenCalledTimes(1);
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
    expect(mockGoogleAuthButton).toHaveBeenCalledTimes(1);
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
    expect(mockLastFMAuthButton).toHaveBeenCalledTimes(1);
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
      const IconComponent = jest.mocked(mockLastFMAuthButton).mock.calls[0][0]
        .iconComponent as () => JSX.Element;
      render(IconComponent());
    });

    it("should call the Avatar component correctly", () => {
      expect(Avatar).toHaveBeenCalledTimes(1);
      expect(Avatar).toHaveBeenCalledTimes(1);
      const call = jest.mocked(Avatar).mock.calls[0][0];
      expect(call.height).toStrictEqual(26);
      expect(call.width).toStrictEqual(26);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(renderToString(call.icon!)).toBe(
        renderToString(<LastFMIconContainer />)
      );
      expect(Object.keys(call).length).toBe(3);
    });
  });

  it("should call the SpotifyAuthButton component correctly", () => {
    expect(mockSpotifyAuthButton).toHaveBeenCalledTimes(1);
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
