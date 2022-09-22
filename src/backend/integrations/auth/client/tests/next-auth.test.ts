import { getToken } from "next-auth/jwt";
import { createAPIMocks } from "../../../../../tests/fixtures/mock.authentication";
import NextAuthClient from "../next-auth";
import type { MockAPIRequest } from "../../../../../types/api.endpoint.types";
import type { AuthVendorSessionType } from "../../../../../types/integrations/auth/vendor.types";
import type { JWT } from "next-auth/jwt";

jest.mock("../../../../../utils/voids", () => {
  const module = require("../../../../../utils/tests/voids.mock");
  return { normalizeNull: module.mockNormalizeNull };
});

jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
}));

describe(NextAuthClient.name, () => {
  let instance: NextAuthClient;
  let mockRequest: MockAPIRequest;
  let originalEnvironment: typeof process.env;
  const mockJWTSecret = "mockJWTSecret";
  const mockValidJWT = {
    email: "mock@mock.com",
    group: "mockGroup",
    name: "mockName",
    picture: "https://mockprofile.com/mock.jpeg",
  } as JWT;
  const mockValidNullJWT = {
    email: null,
    group: null,
    name: null,
    picture: null,
  } as JWT;
  const mockValidSession = {
    email: `normalizeNull(${mockValidJWT.email})`,
    group: `normalizeNull(${mockValidJWT.group})`,
    image: `normalizeNull(${mockValidJWT.picture})`,
    name: `normalizeNull(${mockValidJWT.name})`,
  } as AuthVendorSessionType;
  const mockValidNullSession = {
    email: `normalizeNull(null)`,
    image: `normalizeNull(null)`,
    name: `normalizeNull(null)`,
    group: `normalizeNull(null)`,
  } as AuthVendorSessionType;

  beforeEach(() => {
    jest.clearAllMocks();
    setupEnv();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const setupEnv = () => {
    process.env.AUTH_MASTER_JWT_SECRET = mockJWTSecret;
  };

  const arrange = () => {
    ({ req: mockRequest } = createAPIMocks({}));
    instance = new NextAuthClient(mockRequest);
  };

  describe("when initialized", () => {
    beforeEach(() => arrange());

    describe("with a valid JWT", () => {
      beforeEach(() =>
        (getToken as jest.Mock).mockReturnValueOnce(mockValidJWT)
      );

      describe("getSession", () => {
        let result: AuthVendorSessionType;

        beforeEach(async () => {
          result = await instance.getSession();
        });

        it("should call the underlying vendor function as expected", () => {
          expect(getToken).toBeCalledTimes(1);
          expect(getToken).toBeCalledWith({
            req: mockRequest,
            secret: mockJWTSecret,
          });
        });

        it("should return the expected session", () => {
          expect(result).toStrictEqual(mockValidSession);
        });
      });
    });

    describe("with an incomplete JWT", () => {
      beforeEach(() =>
        (getToken as jest.Mock).mockReturnValueOnce(mockValidNullJWT)
      );

      describe("getSession", () => {
        let result: AuthVendorSessionType;

        beforeEach(async () => {
          result = await instance.getSession();
        });

        it("should call the underlying vendor function as expected", () => {
          expect(getToken).toBeCalledTimes(1);
          expect(getToken).toBeCalledWith({
            req: mockRequest,
            secret: mockJWTSecret,
          });
        });

        it("should return the expected session", () => {
          expect(result).toStrictEqual(mockValidNullSession);
        });
      });
    });

    describe("with a invalid JWT", () => {
      beforeEach(() => (getToken as jest.Mock).mockReturnValueOnce(null));

      describe("getToken", () => {
        let result: AuthVendorSessionType;

        beforeEach(async () => {
          result = await instance.getSession();
        });

        it("should call the underlying vendor function as expected", () => {
          expect(getToken).toBeCalledTimes(1);
          expect(getToken).toBeCalledWith({
            req: mockRequest,
            secret: mockJWTSecret,
          });
        });

        it("should return the expected session", () => {
          expect(result).toBe(null);
        });
      });
    });
  });
});
