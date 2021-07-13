import React from "react";

import { act, waitFor } from "@testing-library/react";

import { renderHook } from "@testing-library/react-hooks";
import { UserContext } from "../../providers/user/user.provider";
import { UserContextInterface } from "../../types/user.types";
import useLastFM from "../lastfm";
import { InitialState } from "../../providers/user/user.initial";
import { postData } from "../../utils/http";
import Events from "../../config/events";

const mockEvent = jest.fn();

jest.mock("../analytics", () => {
  return () => {
    return { event: mockEvent };
  };
});

jest.mock("../../utils/http");

interface MockUserContextWithChildren {
  children?: React.ReactNode;
  mockContext: UserContextInterface;
}

describe("useLastFM", () => {
  let mockUserName = "user1234";
  let mockAPIResponse = { response: "mocked data" };
  let received: ReturnType<typeof arrange>;
  let mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockUserContextWithChildren) => {
    return (
      <UserContext.Provider value={mockContext}>
        {children}
      </UserContext.Provider>
    );
  };

  const setUpRetrieve = (success: boolean) => {
    if (success) {
      (postData as jest.Mock).mockResolvedValueOnce(mockAPIResponse);
    } else {
      (postData as jest.Mock).mockRejectedValueOnce(mockAPIResponse);
    }
  };

  const arrange = (providerProps: UserContextInterface) => {
    return renderHook(() => useLastFM(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("is rendered", () => {
    beforeEach(() => {
      received = arrange({
        userProperties: { ...InitialState },
        dispatch: mockDispatch,
      });
    });

    it("should contain the correct properties", () => {
      expect(received.result.current.userProperties).toStrictEqual(
        InitialState
      );
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.top20).toBeInstanceOf(Function);
      expect(received.result.current.clear).toBeInstanceOf(Function);
    });
  });

  describe("when retrieve is called", () => {
    describe("when a response is successful", () => {
      beforeEach(() => setUpRetrieve(true));

      it("should dispatch the reducer correctly", async () => {
        act(() => received.result.current.top20(mockUserName));
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "SuccessFetchUser",
          userName: mockUserName,
          data: mockAPIResponse,
        });
      });

      it("should register events correctly", async () => {
        act(() => received.result.current.top20(mockUserName));
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(Events.Search);
        expect(mockEvent).toHaveBeenCalledWith(Events.SuccessProfile);
      });
    });

    describe("when a response fails", () => {
      beforeEach(() => setUpRetrieve(false));

      it("should dispatch the reducer correctly", async () => {
        act(() => received.result.current.top20(mockUserName));
        await waitFor(() => expect(mockDispatch).toBeCalledTimes(2));
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "StartFetchUser",
          userName: mockUserName,
        });
        expect(mockDispatch).toHaveBeenCalledWith({
          type: "FailureFetchUser",
          userName: mockUserName,
        });
      });

      it("should register events correctly", async () => {
        act(() => received.result.current.top20(mockUserName));
        await waitFor(() => expect(mockEvent).toBeCalledTimes(2));
        expect(mockEvent).toHaveBeenCalledWith(Events.Search);
        expect(mockEvent).toHaveBeenCalledWith(Events.ErrorProfile);
      });
    });
  });

  describe("when clear is called", () => {
    it("should dispatch the reducer correctly", async () => {
      act(() => received.result.current.clear());
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ResetState",
      });
    });
  });
});
