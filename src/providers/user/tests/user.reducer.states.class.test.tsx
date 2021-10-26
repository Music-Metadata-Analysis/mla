import { InitialState } from "../user.initial";
import UserReducerStates from "../user.reducer.states.class";
import type { UserActionType } from "../../../types/user/action.types";
import type { UserStateInterface } from "../../../types/user/state.types";

describe("UserReducerStates", () => {
  let reducerStates: UserReducerStates;
  let received: UserStateInterface;
  let mockRetries: number;
  const testIntegrationType = "TEST";
  const testUserName = "somebody";
  const emptyReport = { albums: [], artists: [], image: [], tracks: [] };
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

  const arrange = (action: UserActionType, state = { ...InitialState }) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: UserActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...InitialState }, {
        type: "InvalidAction",
      } as never as UserActionType);
  };

  describe("FailureFetchUser", () => {
    const testType = "FailureFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: "FailureFetchUser",
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(testType);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("NotFoundFetchUser", () => {
    const testType = "NotFoundFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(testType);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("RatelimitedFetchUser", () => {
    const testType = "RatelimitedFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(testType);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("ReadyFetchUser", () => {
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
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: mock_lastfm_data,
      });
      expect(received.error).toBe(null);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("ResetState", () => {
    const testType = "ResetState" as const;

    it("should return the the expected state", () => {
      received = arrange({ type: testType });

      expect(received.inProgress).toBe(false);
      expect(received.userName).toBe(null);
      expect(received.data).toStrictEqual({
        integration: null,
        report: emptyReport,
      });
      expect(received.error).toBe(null);
      expect(received.profileUrl).toBe(null);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("StartFetchUser", () => {
    const testType = "StartFetchUser" as const;

    describe("with positive retries remaining", () => {
      beforeEach(() => {
        mockRetries = 3;
      });

      it("should return the the expected state", () => {
        received = arrange(
          {
            type: testType,
            userName: testUserName,
            integration: testIntegrationType,
          },
          { ...InitialState, retries: mockRetries }
        );

        expect(received.inProgress).toBe(true);
        expect(received.userName).toBe(testUserName);
        expect(received.data).toStrictEqual({
          integration: testIntegrationType,
          report: emptyReport,
        });
        expect(received.error).toBe(null);
        expect(received.profileUrl).toBe(null);
        expect(received.ready).toBe(false);
        expect(received.retries).toBe(reducerStates.initalRetries);
      });

      it("should not accept incompatible types", () => {
        expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
      });
    });
  });

  describe("SuccessFetchUser", () => {
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
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: mock_lastfm_data,
      });
      expect(received.error).toBe(null);
      expect(received.ready).toBe(false);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });

  describe("TimeoutFetchUser", () => {
    const testType = "TimeoutFetchUser" as const;

    describe("with positive retries remaining", () => {
      beforeEach(() => {
        mockRetries = 3;
      });

      it("should return the the expected state", () => {
        received = arrange(
          {
            type: testType,
            userName: testUserName,
            integration: testIntegrationType,
          },
          { ...InitialState, retries: mockRetries }
        );

        expect(received.inProgress).toBe(false);
        expect(received.profileUrl).toBe(null);
        expect(received.userName).toBe(testUserName);
        expect(received.data).toStrictEqual({
          integration: testIntegrationType,
          report: emptyReport,
        });
        expect(received.error).toBe(testType);
        expect(received.ready).toBe(false);
        expect(received.retries).toBe(mockRetries - 1);
      });

      it("should not accept incompatible types", () => {
        expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
      });
    });

    describe("with no retries remaining", () => {
      beforeEach(() => {
        mockRetries = 0;
      });

      it("should return the the expected state", () => {
        received = arrange(
          {
            type: testType,
            userName: testUserName,
            integration: testIntegrationType,
          },
          { ...InitialState, retries: mockRetries }
        );

        expect(received.inProgress).toBe(false);
        expect(received.profileUrl).toBe(null);
        expect(received.userName).toBe(testUserName);
        expect(received.data).toStrictEqual({
          integration: testIntegrationType,
          report: emptyReport,
        });
        expect(received.error).toBe("FailureFetchUser");
        expect(received.ready).toBe(true);
        expect(received.retries).toBe(mockRetries);
      });

      it("should not accept incompatible types", () => {
        expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
      });
    });
  });

  describe("UnauthorizedFetchUser", () => {
    const testType = "UnauthorizedFetchUser" as const;

    it("should return the the expected state", () => {
      received = arrange({
        type: testType,
        userName: testUserName,
        integration: testIntegrationType,
      });

      expect(received.inProgress).toBe(false);
      expect(received.profileUrl).toBe(null);
      expect(received.userName).toBe(testUserName);
      expect(received.data).toStrictEqual({
        integration: testIntegrationType,
        report: emptyReport,
      });
      expect(received.error).toBe(testType);
      expect(received.ready).toBe(true);
      expect(received.retries).toBe(reducerStates.initalRetries);
    });

    it("should not accept incompatible types", () => {
      expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
    });
  });
});
