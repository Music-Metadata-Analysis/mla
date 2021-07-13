import { UserStateInterface, UserActionType } from "../../../types/user.types";

import InitialValues from "../user.initial";

import { UserReducer } from "../user.reducer";
import { TopAlbumsProxyResponseInterface } from "../../../types/proxy.types";

describe("UserReducer", () => {
  let received: UserStateInterface | null;

  beforeEach(() => {
    received = null;
  });

  const arrange = (action: UserActionType | { type: "NoAction" }) => {
    return UserReducer(
      { ...InitialValues.userProperties },
      action as UserActionType
    );
  };

  it("should have the expected default values", () => {
    received = arrange({ type: "NoAction" });
    expect(received).toStrictEqual(InitialValues.userProperties);
  });

  it("should handle ResetState correctly", () => {
    received = arrange({ type: "ResetState" });
    expect(received.userName).toBe("");
    expect(received.data).toStrictEqual({});
    expect(received.error).toBe(false);
    expect(received.profileUrl).toBe(null);
    expect(received.ready).toBe(false);
  });

  it("should handle StartFetchUser correctly", () => {
    const mockPayload = { mock: "data" };
    received = arrange({ type: "StartFetchUser", userName: "niall" });
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
    received = arrange({
      type: "SuccessFetchUser",
      userName: "someguy",
      data: mock_lastfm_data as TopAlbumsProxyResponseInterface,
    });
    expect(received.profileUrl).toBe("https://www.last.fm/user/someguy");
    expect(received.userName).toBe("someguy");
    expect(received.data).toStrictEqual(mock_lastfm_data);
    expect(received.error).toBe(false);
    expect(received.ready).toBe(true);
  });

  it("should handle FailureFetchUser correctly", () => {
    received = arrange({
      type: "FailureFetchUser",
      userName: "someguy",
    });
    expect(received.profileUrl).toBe(null);
    expect(received.userName).toBe("someguy");
    expect(received.data).toStrictEqual({});
    expect(received.error).toBe(true);
    expect(received.ready).toBe(false);
  });
});
