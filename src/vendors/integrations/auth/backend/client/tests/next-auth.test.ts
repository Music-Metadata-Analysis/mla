import { getToken } from "next-auth/jwt";
import NextAuthClient from "../next-auth";
import { createAPIMocks } from "@src/vendors/integrations/api.framework/fixtures";
import type { MockAPIEndpointRequestType } from "@src/vendors/types/integrations/api.framework/vendor.fixture.types";
import type { AuthVendorSessionType } from "@src/vendors/types/integrations/auth/vendor.backend.types";
import type { JWT } from "next-auth/jwt";

jest.mock("@src/utilities/generics/voids");

jest.mock("next-auth/jwt");

const MockedGetToken = jest.mocked(getToken);

describe(NextAuthClient.name, () => {
  let instance: NextAuthClient;
  let mockRequest: MockAPIEndpointRequestType;
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
      beforeEach(() => MockedGetToken.mockResolvedValueOnce(mockValidJWT));

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
      beforeEach(() => MockedGetToken.mockResolvedValueOnce(mockValidNullJWT));

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
      beforeEach(() => MockedGetToken.mockResolvedValueOnce(null));

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
