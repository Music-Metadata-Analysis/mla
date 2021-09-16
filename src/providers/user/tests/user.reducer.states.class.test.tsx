import UserReducerStates from "../user.reducer.states.class";
import type { UserActionType } from "../../../types/user/action.types";
import type { UserStateInterface } from "../../../types/user/state.types";

describe("UserReducerStates", () => {
  let reducerStates: UserReducerStates;
  const testIntegrationType = "TEST";
  const testUserName = "somebody";
  const emptyReport = { albums: [], image: [] };
  const mock_lastfm_data = {
    albums: [],
    image: [
      {
        size: "large" as const,
        "#text": "http://someurl.com",
      },
    ],
  };

  beforeEach(() => {
    reducerStates = new UserReducerStates();
  });

  const arrange = (action: UserActionType) => {
    return reducerStates[action.type](action);
  };

  const arrangeError = (testType: UserActionType["type"]) => {
    return () =>
      reducerStates[testType]({
        type: "InvalidAction",
      } as never as UserActionType);
  };

  describe("FailureFetchUser", () => {
    let received: UserStateInterface;
    const testType = "FailureFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: "FailureFetchUser",
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.ratelimited).toBe(false);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(true);
      expect(received.ready).toBe(true);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("RatelimitedFetchUser", () => {
    let received: UserStateInterface;
    const testType = "RatelimitedFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.ratelimited).toBe(true);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(true);
      expect(received.ready).toBe(true);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("ReadyFetchUser", () => {
    let received: UserStateInterface;
    const testType = "ReadyFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        data: mock_lastfm_data,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(
        `https://www.last.fm/user/${testUserName}`
      );
      expect(received.userName).toBe(testUserName);
      expect(received.ratelimited).toBe(false);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: mock_lastfm_data,
      });
      expect(received.error).toBe(false);
      expect(received.ready).toBe(true);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("ResetState", () => {
    let received: UserStateInterface;
    const testType = "ResetState" as const;

    it("should return the the expected state", () => {
      received = arrange({ type: testType });

      expect(received.inProgress).toBe(false);
      expect(received.userName).toBe(null);
      expect(received.data).toStrictEqual({
        integration: null,
        report: emptyReport,
      });
      expect(received.ratelimited).toBe(false);
      expect(received.error).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.ready).toBe(true);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("NotFoundFetchUser", () => {
    let received: UserStateInterface;
    const testType = "NotFoundFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.ratelimited).toBe(false);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(false);
      expect(received.ready).toBe(true);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("StartFetchUser", () => {
    let received: UserStateInterface;
    const testType = "StartFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(true);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.ready).toBe(false);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("SuccessFetchUser", () => {
    let received: UserStateInterface;
    const testType = "SuccessFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        data: mock_lastfm_data,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.userName).toBe(testUserName);
      expect(received.ratelimited).toBe(false);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: mock_lastfm_data,
      });
      expect(received.error).toBe(false);
      expect(received.ready).toBe(false);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });
});
