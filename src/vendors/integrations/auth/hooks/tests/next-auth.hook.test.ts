import { waitFor, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import useNextAuth from "../next-auth";
import PersistentStateFactory from "@src/utilities/react/hooks/local.storage/persisted.state.hook.factory.class";
import {
  mockAuthHook,
  mockUserProfile,
} from "@src/vendors/integrations/auth/__mocks__/vendor.mock";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { AuthVendorSessionType } from "@src/vendors/types/integrations/auth/vendor.types";

jest.mock(
  "@src/utilities/react/hooks/local.storage/persisted.state.hook.factory.class"
);

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const MockedUseSession = useSession as jest.Mock;

describe("useNextAuth", () => {
  let received: ReturnType<typeof arrange>;
  let existingLocalStorageValue: { type: string | null };

  const mockIsSSRValue = "mockIsSSR" as unknown as boolean;

  const useMockLocalStorageHook = jest.fn(() =>
    useState<{ type: string | null }>(existingLocalStorageValue)
  );

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
    jest
      .mocked(PersistentStateFactory.prototype.create)
      .mockReturnValue(useMockLocalStorageHook);
    mockIsSSR.mockReturnValue(mockIsSSRValue);
  });

  const arrange = () => {
    return renderHook(() => useNextAuth());
  };

  const checkLocalStorage = () => {
    it("should instantiate the factory as expected", () => {
      expect(PersistentStateFactory).toBeCalledTimes(1);
      expect(PersistentStateFactory).toBeCalledWith();
    });

    it("should initialize the local storage hook with the correct partition name", () => {
      expect(PersistentStateFactory.prototype.create).toBeCalledTimes(1);
      expect(PersistentStateFactory.prototype.create).toBeCalledWith(
        "oauth",
        mockIsSSRValue
      );
    });

    it("should initialize the state with the expected value", () => {
      expect(useMockLocalStorageHook).toBeCalledTimes(1);
      expect(useMockLocalStorageHook).toBeCalledWith({ type: null });
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

  const checkHookProperties = (profile: AuthVendorSessionType) => {
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
          MockedUseSession.mockImplementation(() => ({
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
          MockedUseSession.mockImplementation(() => ({
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
          MockedUseSession.mockImplementation(() => ({
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
          MockedUseSession.mockImplementation(() => ({
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
          MockedUseSession.mockImplementation(() => ({
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
        MockedUseSession.mockImplementation(() => ({
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
        MockedUseSession.mockImplementation(() => ({
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
