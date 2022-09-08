import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import S3Profile from "../../../backend/integrations/auth/s3profile.class";
import settings from "../../../config/auth";
import NextAuthConfig from "../../../pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/providers/facebook", () => jest.fn());
jest.mock("next-auth/providers/github", () => jest.fn());
jest.mock("next-auth/providers/google", () => jest.fn());
jest.mock("next-auth/providers/spotify", () => jest.fn());
jest.mock("../../../backend/integrations/auth/s3profile.class", () =>
  jest.fn(() => ({
    writeProfileToS3: mockWriteProfileToS3,
  }))
);

const mockWriteProfileToS3 = jest.fn();

describe("NextAuthConfig", () => {
  let originalEnvironment: typeof process.env;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let req: MockRequest<NextApiRequest>;
  // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
  let res: MockResponse<NextApiResponse>;
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
    // @ts-ignore: Fixing this: https://github.com/howardabrams/node-mocks-http/issues/245
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: "/",
      method: "GET",
    }));
    await NextAuthConfig(req, res);
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

      it("should instantiate the S3 client correctly", () => {
        expect(S3Profile).toBeCalledTimes(1);
        expect(S3Profile).toBeCalledWith(process.env.AUTH_EMAILS_BUCKET_NAME);
      });

      it("should write the profile to S3", () => {
        expect(mockWriteProfileToS3).toBeCalledTimes(1);
        expect(mockWriteProfileToS3).toBeCalledWith(mockProfile);
      });
    });
  });
});
