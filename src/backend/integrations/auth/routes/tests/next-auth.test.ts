import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import settings from "../../../../../config/auth";
import { createAPIMocks } from "../../../../../tests/fixtures/mock.authentication";
import createRoutes from "../next-auth";
import type {
  MockAPIRequest,
  MockAPIResponse,
} from "../../../../../types/api.endpoint.types";

jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/providers/facebook", () => jest.fn());
jest.mock("next-auth/providers/github", () => jest.fn());
jest.mock("next-auth/providers/google", () => jest.fn());
jest.mock("next-auth/providers/spotify", () => jest.fn());

const MockProfilePersistanceClient = jest.fn(() => ({
  persistProfile: mockPersistProfile,
}));
const mockPersistProfile = jest.fn();

describe("NextAuthRoutes", () => {
  let originalEnvironment: typeof process.env;
  let mockReq: MockAPIRequest;
  let mockRes: MockAPIResponse;
  let mockValueIndex = 0;

  function mockValue() {
    const value = `mockValue${mockValueIndex}`;
    mockValueIndex++;
    return value;
  }

  beforeAll(() => {
    originalEnvironment = process.env;
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = async () => {
    ({ req: mockReq, res: mockRes } = createAPIMocks({
      url: "/",
      method: "GET",
    }));
    await createRoutes(MockProfilePersistanceClient)(mockReq, mockRes);
  };

  describe("NextAuth processes a request", () => {
    const mockProfile = { name: "Simple Human" };

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
      expect(call.session.maxAge).toBe(settings.maxAge);
      expect(call.session.strategy).toBe("jwt");
    });

    it("should initialize a signIn event handler", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(typeof call.events.signIn).toBe("function");
    });

    describe("when a signIn event is triggered", () => {
      beforeEach(() => {
        const call = (NextAuth as jest.Mock).mock.calls[0][2];
        expect(typeof call.events.signIn).toBe("function");
        const eventHandler = call.events.signIn;

        eventHandler({ profile: mockProfile });
      });

      it("should instantiate the ProfilePersistanceClient class correctly", () => {
        expect(MockProfilePersistanceClient).toBeCalledTimes(1);
        expect(MockProfilePersistanceClient).toBeCalledWith(
          process.env.AUTH_EMAILS_BUCKET_NAME
        );
      });

      it("should call the persistProfile method correctly", () => {
        expect(mockPersistProfile).toBeCalledTimes(1);
        expect(mockPersistProfile).toBeCalledWith(mockProfile);
      });
    });
  });
});
