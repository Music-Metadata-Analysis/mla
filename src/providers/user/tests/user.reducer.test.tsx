import { UserStateInterface, UserActionType } from "../../../types/user.types";

import InitialValues from "../user.initial";

import { UserReducer } from "../user.reducer";
import { TopAlbumsProxyResponseInterface } from "../../../types/proxy.types";

describe("UserReducer", () => {
  let received: UserStateInterface | null;
  const badInitialUserState = {
    userName: "somebody",
    ratelimited: true,
    data: {},
    error: true,
    profileUrl: "http://localhost",
    ready: true,
  };

  beforeEach(() => {
    received = null;
  });

  const arrange = (
    action: UserActionType | { type: "NoAction" },
    initialProps: UserStateInterface
  ) => {
    return UserReducer({ ...initialProps }, action as UserActionType);
  };

  it("should have the expected default values", () => {
    received = arrange(
      { type: "NoAction" },
      { ...InitialValues.userProperties }
    );
    expect(received).toStrictEqual(InitialValues.userProperties);
  });

  it("should handle ResetState correctly", () => {
    received = arrange({ type: "ResetState" }, badInitialUserState);
    expect(received.userName).toBe("");
    expect(received.data).toStrictEqual({});
    expect(received.ratelimited).toBe(false);
    expect(received.error).toBe(false);
    expect(received.profileUrl).toBe(null);
    expect(received.ready).toBe(false);
  });

  it("should handle StartFetchUser correctly", () => {
    const mockPayload = { mock: "data" };
    received = arrange(
      { type: "StartFetchUser", userName: "niall" },
      badInitialUserState
    );
    expect(received.userName).toBe("niall");
    expect(received.data).toStrictEqual({});
    expect(received.error).toBe(false);
    expect(received.profileUrl).toBe(null);
    expect(received.ready).toBe(false);
  });

  it("should handle SuccessFetchUser correctly", () => {
    const mock_lastfm_data = {
      albums: [],
      image: [
        {
          size: "large",
          "#text": "http://someurl.com",
        },
      ],
    };
    received = arrange(
      {
        type: "SuccessFetchUser",
        userName: "someguy",
        data: mock_lastfm_data as TopAlbumsProxyResponseInterface,
      },
      badInitialUserState
    );
    expect(received.profileUrl).toBe("https://www.last.fm/user/someguy");
    expect(received.userName).toBe("someguy");
    expect(received.ratelimited).toBe(false);
    expect(received.data).toStrictEqual(mock_lastfm_data);
    expect(received.error).toBe(false);
    expect(received.ready).toBe(true);
  });

  it("should handle FailureFetchUser correctly", () => {
    received = arrange(
      {
        type: "FailureFetchUser",
        userName: "someguy",
      },
      { ...InitialValues.userProperties }
    );
    expect(received.profileUrl).toBe(null);
    expect(received.ratelimited).toBe(false);
    expect(received.userName).toBe("someguy");
    expect(received.data).toStrictEqual({});
    expect(received.error).toBe(true);
    expect(received.ready).toBe(false);
  });

  it("should handle RatelimitedFetchUser correctly", () => {
    received = arrange(
      {
        type: "RatelimitedFetchUser",
        userName: "someguy",
      },
      { ...InitialValues.userProperties }
    );
    expect(received.profileUrl).toBe(null);
    expect(received.ratelimited).toBe(true);
    expect(received.userName).toBe("someguy");
    expect(received.data).toStrictEqual({});
    expect(received.error).toBe(true);
    expect(received.ready).toBe(false);
  });
});
