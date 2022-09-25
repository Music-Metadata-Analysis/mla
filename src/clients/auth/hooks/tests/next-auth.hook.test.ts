import { waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import useNextAuth from "../next-auth";
import mockAuthHook, { mockUserProfile } from "@src/hooks/tests/auth.mock.hook";
import type { AuthSessionType } from "@src/types/clients/auth/vendor.types";

jest.mock("@src/hooks/utility/local.storage", () => ({
  getPersistedUseState: () => mockUseLocalStorage,
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const mockUseLocalStorage = jest.fn(() => useMockLocalStorageHook());
const useMockLocalStorageHook = () => {
  return useState<{ type: string | null }>(existingLocalStorageValue);
};

let existingLocalStorageValue: { type: string | null };

describe("useNextAuth", () => {
  let received: ReturnType<typeof arrange>;
  const mockOauthProvider = "google";
  const mockSession = {
    group: "mockGroup",
    user: {
      name: mockUserProfile.name,
      email: mockUserProfile.email,
      image: mockUserProfile.image,
      oauth: mockUserProfile.oauth,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useNextAuth());
  };

  const checkLocalStorage = () => {
    it("should initialize local storage access as expected", () => {
      expect(mockUseLocalStorage).toBeCalledTimes(1);
      expect(mockUseLocalStorage).toBeCalledWith("oauth", { type: null });
    });
  };

  const checkHookFunctions = () => {
    describe("signIn", () => {
      describe("when called with an oauth provider", () => {
        beforeEach(async () =>
          act(
            async () => await received.result.current.signIn(mockOauthProvider)
          )
        );

        it("should call the underlying next-auth signIn function correctly", () => {
          expect(signIn).toBeCalledTimes(1);
          expect(signIn).toBeCalledWith(mockOauthProvider);
        });

        it("should set the oauth property correctly", async () => {
          await waitFor(() =>
            expect(received.result.current.user?.oauth).toStrictEqual(
              mockOauthProvider
            )
          );
        });
      });
    });

    describe("signOut", () => {
      describe("when called ", () => {
        beforeEach(async () =>
          act(async () => await received.result.current.signOut())
        );

        it("should call the underlying next-auth signOut function correctly", () => {
          expect(signOut).toBeCalledWith();
        });

        it("should clear the oauth property correctly", async () => {
          await waitFor(() =>
            expect(received.result.current.user?.oauth).toBeNull()
          );
        });
      });
    });
  };

  const checkHookProperties = (profile: AuthSessionType) => {
    if (profile) checkHookFunctions();

    it("should contain all the same properties as the mock hook", () => {
      mockAuthHook.user = profile;
      const mockObjectKeys = dk(
        mockAuthHook as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(JSON.stringify(hookKeys)).toBe(JSON.stringify(mockObjectKeys));
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.signIn).toBe("function");
      expect(typeof received.result.current.signOut).toBe("function");
    });
  };

  describe("when rendered", () => {
    describe("with user who is signed in", () => {
      describe("with a complete profile", () => {
        beforeEach(() => {
          (useSession as jest.Mock).mockImplementation(() => ({
            data: { ...mockSession },
            status: "authenticated",
          }));
          existingLocalStorageValue = { type: mockUserProfile.oauth };
          received = arrange();
        });

        checkLocalStorage();
        checkHookProperties({ ...mockUserProfile, oauth: mockOauthProvider });

        it("should return status as authenticated", () => {
          expect(received.result.current.status).toBe("authenticated");
        });

        it("should return the correct user profile", () => {
          expect(received.result.current.user).toStrictEqual({
            ...mockUserProfile,
          });
        });
      });

      describe("with a profile missing a name", () => {
        beforeEach(() => {
          (useSession as jest.Mock).mockImplementation(() => ({
            data: {
              ...mockSession,
              user: { ...mockSession.user, name: undefined },
            },
            status: "authenticated",
          }));
          existingLocalStorageValue = { type: mockUserProfile.oauth };
          received = arrange();
        });

        checkLocalStorage();
        checkHookProperties({
          ...mockUserProfile,
          name: undefined,
          oauth: mockOauthProvider,
        });

        it("should return status as authenticated", () => {
          expect(received.result.current.status).toBe("authenticated");
        });

        it("should return the correct user profile", () => {
          expect(received.result.current.user).toStrictEqual({
            ...mockUserProfile,
            name: undefined,
          });
        });
      });

      describe("with a profile missing an email", () => {
        beforeEach(() => {
          (useSession as jest.Mock).mockImplementation(() => ({
            data: {
              ...mockSession,
              user: { ...mockSession.user, email: undefined },
            },
            status: "authenticated",
          }));
          existingLocalStorageValue = { type: mockUserProfile.oauth };
          received = arrange();
        });

        checkLocalStorage();
        checkHookProperties({
          ...mockUserProfile,
          email: undefined,
          oauth: mockOauthProvider,
        });

        it("should return status as authenticated", () => {
          expect(received.result.current.status).toBe("authenticated");
        });

        it("should return the correct user profile", () => {
          expect(received.result.current.user).toStrictEqual({
            ...mockUserProfile,
            email: undefined,
          });
        });
      });

      describe("with a profile missing an image", () => {
        beforeEach(() => {
          (useSession as jest.Mock).mockImplementation(() => ({
            data: {
              ...mockSession,
              user: { ...mockSession.user, image: undefined },
            },
            status: "authenticated",
          }));
          existingLocalStorageValue = { type: mockUserProfile.oauth };
          received = arrange();
        });

        checkLocalStorage();
        checkHookProperties({
          ...mockUserProfile,
          image: undefined,
          oauth: mockOauthProvider,
        });

        it("should return status as authenticated", () => {
          expect(received.result.current.status).toBe("authenticated");
        });

        it("should return the correct user profile", () => {
          expect(received.result.current.user).toStrictEqual({
            ...mockUserProfile,
            image: undefined,
          });
        });
      });

      describe("with a profile missing a group", () => {
        beforeEach(() => {
          (useSession as jest.Mock).mockImplementation(() => ({
            data: {
              user: { ...mockSession.user },
            },
            status: "authenticated",
          }));
          existingLocalStorageValue = { type: mockUserProfile.oauth };
          received = arrange();
        });

        checkLocalStorage();
        checkHookProperties({
          ...mockUserProfile,
          group: undefined,
          oauth: mockOauthProvider,
        });

        it("should return status as authenticated", () => {
          expect(received.result.current.status).toBe("authenticated");
        });

        it("should return the correct user profile", () => {
          expect(received.result.current.user).toStrictEqual({
            ...mockUserProfile,
            group: undefined,
          });
        });
      });
    });

    describe("with user who is NOT signed in", () => {
      beforeEach(() => {
        (useSession as jest.Mock).mockImplementation(() => ({
          data: {
            user: { mock: "data" },
          },
          status: "unauthenticated",
        }));
        received = arrange();
      });

      checkLocalStorage();
      checkHookProperties(null);

      it("should return status as unauthenticated", () => {
        expect(received.result.current.status).toBe("unauthenticated");
      });

      it("should return the correct user profile", () => {
        expect(received.result.current.user).toStrictEqual(null);
      });
    });

    describe("with user who is in the process of signing in", () => {
      beforeEach(() => {
        (useSession as jest.Mock).mockImplementation(() => ({
          data: {
            user: { mock: "data" },
          },
          status: "loading",
        }));
        existingLocalStorageValue = { type: null };
        received = arrange();
      });

      checkLocalStorage();
      checkHookProperties(null);

      it("should return status as processing", () => {
        expect(received.result.current.status).toBe("processing");
      });

      it("should return the correct user profile", () => {
        expect(received.result.current.user).toStrictEqual(null);
      });
    });
  });
});
