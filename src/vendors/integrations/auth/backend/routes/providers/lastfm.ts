import apiRoutes from "@src/config/apiRoutes";
import { lastFMVendorBackend } from "@src/vendors/integrations/lastfm/vendor.backend";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { TokenSet, User } from "next-auth";
import type { OAuthConfig } from "next-auth/providers";

const LastFMProvider = (): OAuthConfig<LastFMUserProfileInterface> => ({
  id: "lastfm",
  name: "last.fm",
  type: "oauth",
  authorization: {
    url: "http://www.last.fm/api/auth/",
    params: {
      cb:
        String(process.env.NEXTAUTH_URL) +
        apiRoutes.auth.redirect.callback.lastfm,
      api_key: process.env.LAST_FM_KEY,
    },
  },
  client: {
    token_endpoint_auth_method: "none",
    id_token_signed_response_alg: "none",
  },
  clientId: process.env.LAST_FM_KEY,
  clientSecret: process.env.LAST_FM_SECRET,
  checks: ["none"],
  idToken: false,
  token: {
    async request(context) {
      if (context.params.id_token) {
        const signedClient = new lastFMVendorBackend.SignedClient(
          process.env.LAST_FM_KEY,
          process.env.LAST_FM_SECRET
        );
        const response = await signedClient.signedRequest({
          method: "auth.getSession",
          params: [["token", context.params.id_token]],
        });
        if (response.ok) {
          const { session } = await response.json();
          return { tokens: { session_state: JSON.stringify(session) } };
        }
      }
      throw new Error("Unable to perform auth.getSession!");
    },
  },
  userinfo: {
    request: async (context) => {
      let sessionName: string | undefined;
      let sessionKey: string | undefined;
      try {
        const state = JSON.parse(String(context.tokens.session_state));
        sessionName = state.name;
        sessionKey = state.key;
      } catch {}
      if (sessionName && sessionKey) {
        const signedClient = new lastFMVendorBackend.SignedClient(
          process.env.LAST_FM_KEY,
          process.env.LAST_FM_SECRET
        );
        const response = await signedClient.signedRequest({
          method: "user.getInfo",
          params: [["user", sessionName]],
          sk: sessionKey,
        });
        if (response.ok) {
          const userInfo = await response.json();
          return userInfo.user;
        }
      }
      throw new Error("Unable to perform user.getInfo!");
    },
  },
  profile(profile: LastFMUserProfileInterface, tokens: TokenSet): User {
    const image = profile.image.find((data) => data.size === "large");
    const session_state = JSON.parse(String(tokens.session_state));
    return {
      id: String(session_state.subscriber),
      name: session_state.name,
      email: session_state.name + "@last.fm",
      image: image ? image["#text"] : undefined,
    };
  },
});

export default LastFMProvider;
