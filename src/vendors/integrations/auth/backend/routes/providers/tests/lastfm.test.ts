import LastFMProvider from "../lastfm";
import apiRoutes from "@src/config/apiRoutes";
import { lastFMVendorBackend } from "@src/vendors/integrations/lastfm/vendor.backend";
import type { LastFMImageDataInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/image.data.types";
import type { LastFMUserProfileInterface } from "@src/contracts/api/types/services/lastfm/responses/elements/user.profile.types";
import type { TokenSet, User } from "next-auth";
import type { OAuthConfig } from "next-auth/providers";

jest.mock("@src/vendors/integrations/lastfm/vendor.backend");

describe("LastFMProvider", () => {
  let originalEnvironment: typeof process.env;
  let instance: OAuthConfig<LastFMUserProfileInterface>;

  const mockIdToken = "mockIdToken";
  const mockLastFmSession = {
    session: { name: "mockUserName", key: "mockSessionKey", subscriber: 0 },
  };
  const mockUserProfile: LastFMUserProfileInterface = {
    image: [
      {
        size: "small" as const,
        "#text": "https://small",
      },
      {
        size: "medium" as const,
        "#text": "https://medium",
      },
      {
        size: "large" as const,
        "#text": "https://large",
      },
      {
        size: "extralarge" as const,
        "#text": "https://extralarge",
      },
      {
        size: "mega" as const,
        "#text": "https://mega",
      },
      {
        size: "" as const,
        "#text": "https://unknown",
      },
    ],
    playcount: 1000,
  };

  const mockNextAuthUrl = "mockNextAuthUrl";
  const mockLastFmApiKey = "mockLastFmApiKey";
  const mockLastFmSharedSecret = "mockLastFmSharedSecret";

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.NEXTAUTH_URL = mockNextAuthUrl;
    process.env.LAST_FM_KEY = mockLastFmApiKey;
    process.env.LAST_FM_SECRET = mockLastFmSharedSecret;
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => (instance = LastFMProvider());

  describe("when initialized", () => {
    beforeEach(() => arrange());

    const checkInstantiation = () => {
      it("should instantiate the last.fm SignedClient", () => {
        expect(lastFMVendorBackend.SignedClient).toHaveBeenCalledTimes(1);
        expect(lastFMVendorBackend.SignedClient).toHaveBeenCalledWith(
          mockLastFmApiKey,
          mockLastFmSharedSecret
        );
      });
    };

    const checkNoInstantiation = () => {
      it("should NOT instantiate the last.fm SignedClient", () => {
        expect(lastFMVendorBackend.SignedClient).toHaveBeenCalledTimes(0);
      });
    };

    it("should have the correct properties", () => {
      expect(instance.id).toBe("lastfm");
      expect(instance.name).toBe("last.fm");
      expect(instance.type).toBe("oauth");
      expect(instance.authorization).toStrictEqual({
        url: "http://www.last.fm/api/auth/",
        params: {
          cb: mockNextAuthUrl + apiRoutes.auth.redirect.callback.lastfm,
          api_key: mockLastFmApiKey,
        },
      });
      expect(instance.client).toStrictEqual({
        token_endpoint_auth_method: "none",
        id_token_signed_response_alg: "none",
      });
      expect(instance.clientId).toBe(mockLastFmApiKey);
      expect(instance.clientSecret).toBe(mockLastFmSharedSecret);
      expect(instance.checks).toStrictEqual(["none"]);
      expect(instance.idToken).toBe(false);
      expect(instance.token).toBeDefined();
      expect(instance.userinfo).toBeDefined();
      expect(instance.profile).toBeDefined();
      expect(Object.keys(instance).length).toBe(12);
    });

    describe("token.request", () => {
      let result: TokenSet | undefined;
      let thrownError: Error;
      let context: unknown;

      const act = async () => {
        result = undefined;
        try {
          result = await (
            instance.token as {
              request: (context: unknown) => TokenSet;
            }
          ).request(context);
        } catch (err) {
          thrownError = err as Error;
        }
      };

      describe("with a valid context", () => {
        beforeEach(
          () =>
            (context = {
              params: { id_token: mockIdToken },
            })
        );

        describe("with a valid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockLastFmSession),
              } as Response);

            await act();
          });

          checkInstantiation();

          it("should return the correct result", () => {
            expect(result).toStrictEqual({
              tokens: {
                session_state: JSON.stringify(mockLastFmSession.session),
              },
            });
          });
        });

        describe("with an invalid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({}),
              } as Response);

            await act();
          });

          checkInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe(
              "Unable to perform auth.getSession!"
            );
          });
        });
      });

      describe("with a invalid context", () => {
        beforeEach(
          () =>
            (context = {
              params: {},
            })
        );

        describe("with a valid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockLastFmSession),
              } as Response);

            await act();
          });

          checkNoInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe(
              "Unable to perform auth.getSession!"
            );
          });
        });

        describe("with an invalid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({}),
              } as Response);

            await act();
          });

          checkNoInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe(
              "Unable to perform auth.getSession!"
            );
          });
        });
      });
    });

    describe("userinfo.request", () => {
      let result: LastFMUserProfileInterface | undefined;
      let thrownError: Error;
      let context: unknown;

      const act = async () => {
        result = undefined;
        try {
          result = await (
            instance.userinfo as unknown as {
              request: (context: unknown) => LastFMUserProfileInterface;
            }
          ).request(context);
        } catch (err) {
          thrownError = err as Error;
        }
      };

      describe("with a valid context", () => {
        beforeEach(
          () =>
            (context = {
              tokens: {
                session_state: JSON.stringify(mockLastFmSession.session),
              },
            })
        );

        describe("with a valid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ user: mockUserProfile }),
              } as Response);

            await act();
          });

          checkInstantiation();

          it("should return the correct result", () => {
            expect(result).toStrictEqual(mockUserProfile);
          });
        });

        describe("with an invalid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({}),
              } as Response);

            await act();
          });

          checkInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe("Unable to perform user.getInfo!");
          });
        });
      });

      describe("with a invalid context", () => {
        beforeEach(
          () =>
            (context = {
              tokens: {
                session_state: {},
              },
            })
        );

        describe("with a valid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ user: mockUserProfile }),
              } as Response);

            await act();
          });

          checkNoInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe("Unable to perform user.getInfo!");
          });
        });

        describe("with an invalid API response", () => {
          beforeEach(async () => {
            jest
              .mocked(lastFMVendorBackend.SignedClient.prototype.signedRequest)
              .mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({}),
              } as Response);

            await act();
          });

          checkNoInstantiation();

          it("should NOT return a result", () => {
            expect(result).toBeUndefined();
          });

          it("should throw the expected error", () => {
            expect(thrownError.message).toBe("Unable to perform user.getInfo!");
          });
        });
      });
    });

    describe("profile", () => {
      let result: User | undefined;

      const act = async (imageData: LastFMImageDataInterface[]) => {
        result = undefined;
        result = await instance.profile(
          { ...mockUserProfile, image: imageData },
          {
            session_state: JSON.stringify(mockLastFmSession.session),
          }
        );
      };

      describe("with a valid image", () => {
        beforeEach(async () => await act(mockUserProfile.image));

        it("should return the correct result", () => {
          expect(result).toStrictEqual({
            id: String(mockLastFmSession.session.subscriber),
            name: mockLastFmSession.session.name,
            email: mockLastFmSession.session.name + "@last.fm",
            image: mockUserProfile.image[2]["#text"],
          });
        });
      });

      describe("with an invalid image", () => {
        beforeEach(async () => await act([]));

        it("should return the correct result", () => {
          expect(result).toStrictEqual({
            id: String(mockLastFmSession.session.subscriber),
            name: mockLastFmSession.session.name,
            email: mockLastFmSession.session.name + "@last.fm",
            image: undefined,
          });
        });
      });
    });
  });
});
