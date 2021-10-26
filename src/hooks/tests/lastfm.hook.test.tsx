import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import React from "react";
import mockUseLastFMHook from "./lastfm.mock.hook";
import { InitialState } from "../../providers/user/user.initial";
import { UserContext } from "../../providers/user/user.provider";
import useLastFM from "../lastfm";
import type { UserContextInterface } from "../../types/user/context.types";

jest.mock("../../clients/api/reports/lastfm/top20.albums.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      retrieveReport: mockRetrieveTopAlbums,
    };
  });
});

jest.mock("../../clients/api/reports/lastfm/top20.artists.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      retrieveReport: mockRetrieveTopArtists,
    };
  });
});

jest.mock("../../clients/api/reports/lastfm/top20.tracks.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      retrieveReport: mockRetrieveTopTracks,
    };
  });
});

const mockRetrieveTopAlbums = jest.fn();
const mockRetrieveTopArtists = jest.fn();
const mockRetrieveTopTracks = jest.fn();

interface MockUserContextWithChildren {
  children?: React.ReactNode;
  mockContext: UserContextInterface;
}

describe("useLastFM", () => {
  const mockUserName = "user1234";
  const mockDispatch = jest.fn();
  let received: ReturnType<typeof arrange>;

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
      expect(received.result.current.clear).toBeInstanceOf(Function);
      expect(received.result.current.top20albums).toBeInstanceOf(Function);
      expect(received.result.current.top20artists).toBeInstanceOf(Function);
      expect(received.result.current.top20tracks).toBeInstanceOf(Function);
      expect(received.result.current.ready).toBeInstanceOf(Function);
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUseLastFMHook).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  describe("clear", () => {
    it("should dispatch the reducer correctly", async () => {
      act(() => received.result.current.clear());
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ResetState",
      });
    });
  });

  describe("ready", () => {
    it("should dispatch the reducer correctly", async () => {
      act(() => received.result.current.ready());
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ReadyFetchUser",
        userName: received.result.current.userProperties.userName,
        data: received.result.current.userProperties.data.report,
        integration: received.result.current.userProperties.data.integration,
      });
    });
  });

  describe("top20albums", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20albums(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopAlbums).toBeCalledTimes(1));
      expect(mockRetrieveTopAlbums).toHaveBeenCalledWith(mockUserName);
    });
  });

  describe("top20artists", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20artists(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopArtists).toBeCalledTimes(1));
      expect(mockRetrieveTopArtists).toHaveBeenCalledWith(mockUserName);
    });
  });

  describe("top20artists", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20tracks(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopTracks).toBeCalledTimes(1));
      expect(mockRetrieveTopTracks).toHaveBeenCalledWith(mockUserName);
    });
  });
});
