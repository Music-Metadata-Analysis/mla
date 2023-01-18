import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import createRoutes, { getGroup } from "../next-auth";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import nextAuthConfiguration from "@src/vendors/integrations/auth/backend/config/next-auth";
import { mockFlagGroup } from "@src/vendors/integrations/flags/__mocks__/vendor.backend.mock";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type {
  MockAPIEndpointRequestType,
  MockAPIEndpointResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";

jest.mock("next-auth");
jest.mock("next-auth/providers/facebook");
jest.mock("next-auth/providers/github");
jest.mock("next-auth/providers/google");
jest.mock("next-auth/providers/spotify");

jest.mock("@src/vendors/integrations/flags/vendor.backend");

describe("NextAuthRoutes", () => {
  let mockReq: MockAPIEndpointRequestType;
  let mockRes: MockAPIEndpointResponseType;
  let mockValueIndex = 0;

  const MockProfilePersistenceClient = jest.fn(() => ({
    persistProfile: mockPersistProfile,
  }));
  const mockPersistProfile = jest.fn();

  const originalEnvironment = process.env;
  const mockGroup = "mockGroup";

  function mockValue() {
    const value = `mockValue${mockValueIndex}`;
    mockValueIndex++;
    return value;
  }

  const setupEnv = () => {
    process.env.AUTH_FACEBOOK_ID = mockValue();
    process.env.AUTH_FACEBOOK_SECRET = mockValue();
    process.env.AUTH_GITHUB_ID = mockValue();
    process.env.AUTH_GITHUB_SECRET = mockValue();
    process.env.AUTH_GOOGLE_ID = mockValue();
    process.env.AUTH_GOOGLE_SECRET = mockValue();
    process.env.AUTH_MASTER_SECRET_KEY = mockValue();
    process.env.AUTH_MASTER_JWT_SECRET = mockValue();
    process.env.AUTH_SPOTIFY_ID = mockValue();
    process.env.AUTH_SPOTIFY_SECRET = mockValue();
    process.env.FLAG_GROUPS_HASH = JSON.stringify({ mock: mockValue() });
  };

  beforeEach(() => {
    setupEnv();
    jest.clearAllMocks();
    mockFlagGroup.getFromIdentifier.mockImplementation(() => mockGroup);
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: "/",
      method: "GET",
    }));
    await createRoutes(MockProfilePersistenceClient)(mockReq, mockRes);
  };

  describe("getGroup", () => {
    const mockEmail = "mock@mock.com";

    describe("when a valid environment value is set", () => {
      describe("when called on an identity", () => {
        beforeEach(() => getGroup(mockEmail));

        it("should instantiate the flag vendor's Group class correctly", () => {
          expect(flagVendorBackend.Group).toBeCalledTimes(1);
          expect(flagVendorBackend.Group).toBeCalledWith(
            JSON.parse(process.env.FLAG_GROUPS_HASH)
          );
        });

        it("should call the getFromIdentifier method correctly", () => {
          expect(mockFlagGroup.getFromIdentifier).toBeCalledTimes(1);
          expect(mockFlagGroup.getFromIdentifier).toBeCalledWith(mockEmail);
        });
      });
    });

    describe("when a valid environment value is NOT set", () => {
      beforeEach(() => ((process.env.FLAG_GROUPS_HASH as string | null) = ""));

      describe("when called on an identity", () => {
        beforeEach(() => getGroup(mockEmail));

        it("should instantiate the flag vendor's Group class correctly", () => {
          expect(flagVendorBackend.Group).toBeCalledTimes(1);
          expect(flagVendorBackend.Group).toBeCalledWith({});
        });

        it("should call the getFromIdentifier method correctly", () => {
          expect(mockFlagGroup.getFromIdentifier).toBeCalledTimes(1);
          expect(mockFlagGroup.getFromIdentifier).toBeCalledWith(mockEmail);
        });
      });
    });
  });

  describe("NextAuth processes a request", () => {
    const mockProfile = { name: "mockProfile", email: "mock@profile.com" };
    const mockSession = { name: "mockSession", email: "mock@session.com" };
    const mockToken = { token: "mockToken", email: "mock@token.com" };

    beforeEach(async () => {
      await arrange();
    });

    it("should initialize the Facebook Provider", async () => {
      expect(FacebookProvider).toBeCalledTimes(1);
      expect(FacebookProvider).toBeCalledWith({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      });
    });

    it("should initialize the Github Provider", async () => {
      expect(GithubProvider).toBeCalledTimes(1);
      expect(GithubProvider).toBeCalledWith({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      });
    });

    it("should initialize the Google Provider", async () => {
      expect(GoogleProvider).toBeCalledTimes(1);
      expect(GoogleProvider).toBeCalledWith({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      });
    });

    it("should initialize the Spotify Provider", async () => {
      expect(SpotifyProvider).toBeCalledTimes(1);
      expect(SpotifyProvider).toBeCalledWith({
        clientId: process.env.AUTH_SPOTIFY_ID,
        clientSecret: process.env.AUTH_SPOTIFY_SECRET,
      });
    });

    it("should initialize the JWT Key", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.jwt.secret).toBe(process.env.AUTH_MASTER_JWT_SECRET);
    });

    it("should initialize the Secret hash value", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.secret).toBe(process.env.AUTH_MASTER_SECRET_KEY);
    });

    it("should initialize the Session", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.session.maxAge).toBe(nextAuthConfiguration.maxAge);
      expect(call.session.strategy).toBe("jwt");
    });

    it("should initialize a signIn event handler", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(typeof call.events.signIn).toBe("function");
    });

    describe("callbacks", () => {
      let mockTestSession: (typeof mockSession & { group?: string }) | null;
      let mockTestToken: (typeof mockToken & { group?: string }) | null;

      describe("with a token and session", () => {
        beforeEach(() => {
          mockTestSession = { ...mockSession };
          mockTestToken = { ...mockToken };
        });

        describe("jwt", () => {
          let result: typeof mockToken;

          beforeEach(async () => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.callbacks.jwt).toBe("function");
            const callback = call.callbacks.jwt;

            result = await callback({
              token: mockTestToken,
            });
          });

          it("should instantiate the flag vendor's Group class correctly", () => {
            expect(flagVendorBackend.Group).toBeCalledTimes(1);
            expect(flagVendorBackend.Group).toBeCalledWith(
              JSON.parse(process.env.FLAG_GROUPS_HASH)
            );
          });

          it("should call the getFromIdentifier method correctly", () => {
            expect(mockFlagGroup.getFromIdentifier).toBeCalledTimes(1);
            expect(mockFlagGroup.getFromIdentifier).toBeCalledWith(
              mockTestToken?.email
            );
          });

          it("should assign the group as expected", () => {
            expect(mockTestToken?.group).toBe(mockGroup);
          });

          it("should return the token", () => {
            expect(result).toBe(mockTestToken);
          });
        });

        describe("session", () => {
          let result: typeof mockSession;

          beforeEach(async () => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.callbacks.session).toBe("function");
            const callback = call.callbacks.session;

            result = await callback({
              session: mockTestSession,
              token: { ...mockTestToken, group: mockGroup },
            });
          });

          it("should assign the group as expected", () => {
            expect(mockTestSession?.group).toBe(mockGroup);
          });

          it("should return the token", () => {
            expect(result).toBe(mockTestSession);
          });
        });
      });

      describe("without a token and session", () => {
        beforeEach(() => {
          mockTestSession = null;
          mockTestToken = null;
        });

        describe("jwt", () => {
          let result: typeof mockToken;

          beforeEach(async () => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.callbacks.jwt).toBe("function");
            const callback = call.callbacks.jwt;

            result = await callback({
              token: mockTestToken,
            });
          });

          it("should NOT instantiate the flag vendor's Group class", () => {
            expect(flagVendorBackend.Group).toBeCalledTimes(0);
          });

          it("should NOT assign the group", () => {
            expect(mockTestToken?.group).toBeUndefined();
          });

          it("should return the token", () => {
            expect(result).toBe(mockTestToken);
          });
        });

        describe("session", () => {
          let result: typeof mockSession;

          beforeEach(async () => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.callbacks.session).toBe("function");
            const callback = call.callbacks.session;

            result = await callback({
              session: mockTestSession,
              token: mockTestToken,
            });
          });

          it("should NOT instantiate the flag vendor's Group class", () => {
            expect(flagVendorBackend.Group).toBeCalledTimes(0);
          });

          it("should NOT assign the group", () => {
            expect(mockTestSession?.group).toBeUndefined();
          });

          it("should return the token", () => {
            expect(result).toBe(mockTestSession);
          });
        });
      });
    });

    describe("events", () => {
      let mockTestProfile: typeof mockProfile | null;

      describe("with a profile", () => {
        beforeEach(() => {
          mockTestProfile = { ...mockProfile };
        });

        describe("signIn", () => {
          beforeEach(() => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.events.signIn).toBe("function");
            const eventHandler = call.events.signIn;

            eventHandler({ profile: mockTestProfile });
          });

          it("should instantiate the flag vendor's Group class correctly", () => {
            expect(flagVendorBackend.Group).toBeCalledTimes(1);
            expect(flagVendorBackend.Group).toBeCalledWith(
              JSON.parse(process.env.FLAG_GROUPS_HASH)
            );
          });

          it("should call the getFromIdentifier method correctly", () => {
            expect(mockFlagGroup.getFromIdentifier).toBeCalledTimes(1);
            expect(mockFlagGroup.getFromIdentifier).toBeCalledWith(
              mockProfile?.email
            );
          });

          it("should instantiate the ProfilePersistenceClient class correctly", () => {
            expect(MockProfilePersistenceClient).toBeCalledTimes(1);
            expect(MockProfilePersistenceClient).toBeCalledWith(
              process.env.AUTH_EMAILS_BUCKET_NAME
            );
          });

          it("should call the persistProfile method correctly", () => {
            expect(mockPersistProfile).toBeCalledTimes(1);
            expect(mockPersistProfile).toBeCalledWith({
              ...mockProfile,
              group: mockGroup,
            });
          });
        });
      });

      describe("without a profile", () => {
        beforeEach(() => {
          mockTestProfile = null;
        });

        describe("signIn", () => {
          beforeEach(() => {
            const call = (NextAuth as jest.Mock).mock.calls[0][2];
            expect(typeof call.events.signIn).toBe("function");
            const eventHandler = call.events.signIn;

            eventHandler({ profile: mockTestProfile });
          });

          it("should NOT instantiate the flag vendor's Group class", () => {
            expect(flagVendorBackend.Group).toBeCalledTimes(0);
          });

          it("should instantiate the ProfilePersistenceClient class correctly", () => {
            expect(MockProfilePersistenceClient).toBeCalledTimes(1);
            expect(MockProfilePersistenceClient).toBeCalledWith(
              process.env.AUTH_EMAILS_BUCKET_NAME
            );
          });

          it("should call the persistProfile method correctly", () => {
            expect(mockPersistProfile).toBeCalledTimes(1);
            expect(mockPersistProfile).toBeCalledWith(null);
          });
        });
      });
    });
  });
});
