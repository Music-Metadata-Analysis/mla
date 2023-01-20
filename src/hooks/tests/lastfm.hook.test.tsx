import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import React from "react";
import mockHookValues from "../__mocks__/lastfm.hook.mock";
import useLastFM from "../lastfm.hook";
import LastFMPlayCountByArtistDataClient from "@src/clients/api/lastfm/data/sunburst/playcount.by.artist.sunburst.client.class";
import LastFMTopAlbumsReport from "@src/clients/api/lastfm/reports/top20.albums.class";
import LastFMTopArtistsReport from "@src/clients/api/lastfm/reports/top20.artists.class";
import LastFMTopTracksReport from "@src/clients/api/lastfm/reports/top20.tracks.class";
import PlayCountByArtistStateEncapsulation from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import { InitialState } from "@src/providers/user/user.initial";
import { UserContext } from "@src/providers/user/user.provider";
import type { UserContextInterface } from "@src/types/user/context.types";
import type { ReactNode } from "react";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/clients/api/lastfm/reports/top20.albums.class");

jest.mock("@src/clients/api/lastfm/reports/top20.artists.class");

jest.mock("@src/clients/api/lastfm/reports/top20.tracks.class");

jest.mock(
  "@src/clients/api/lastfm/data/sunburst/playcount.by.artist.sunburst.client.class"
);

jest.mock(
  "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class"
);

interface MockUserContextWithChildren {
  children?: ReactNode;
  mockContext: UserContextInterface;
}

describe("useLastFM", () => {
  let received: ReturnType<typeof arrange>;

  const mockUserName = "user1234";

  const mockDispatch = jest.fn();

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
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  describe("clear", () => {
    beforeEach(
      async () => await act(async () => await received.result.current.clear())
    );

    it("should dispatch the reducer correctly", async () => {
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ResetState",
      });
    });
  });

  describe("ready", () => {
    beforeEach(
      async () => await act(async () => await received.result.current.ready())
    );

    it("should dispatch the reducer correctly", async () => {
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ReadyFetch",
        userName: received.result.current.userProperties.userName,
        data: received.result.current.userProperties.data.report,
        integration: received.result.current.userProperties.data.integration,
      });
    });
  });

  describe("top20albums", () => {
    let mockRetrieveTopAlbums: jest.SpyInstance;

    beforeEach(async () => {
      mockRetrieveTopAlbums = jest.spyOn(
        LastFMTopAlbumsReport.prototype,
        "retrieveReport"
      );

      act(() => received.result.current.top20albums(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopAlbums).toBeCalledTimes(1));
      expect(mockRetrieveTopAlbums).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("top20artists", () => {
    let mockRetrieveTopArtists: jest.SpyInstance;

    beforeEach(async () => {
      mockRetrieveTopArtists = jest.spyOn(
        LastFMTopArtistsReport.prototype,
        "retrieveReport"
      );

      act(() => received.result.current.top20artists(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopArtists).toBeCalledTimes(1));
      expect(mockRetrieveTopArtists).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("top20tracks", () => {
    let mockRetrieveTopTracks: jest.SpyInstance;

    beforeEach(async () => {
      mockRetrieveTopTracks = jest.spyOn(
        LastFMTopTracksReport.prototype,
        "retrieveReport"
      );

      act(() => received.result.current.top20tracks(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieveTopTracks).toBeCalledTimes(1));
      expect(mockRetrieveTopTracks).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("playCountByArtist", () => {
    let mockRetrievePlayCountByArtist: jest.SpyInstance;

    beforeEach(async () => {
      mockRetrievePlayCountByArtist = jest.spyOn(
        LastFMPlayCountByArtistDataClient.prototype,
        "retrieveReport"
      );

      act(() => received.result.current.playCountByArtist(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() =>
        expect(PlayCountByArtistStateEncapsulation).toBeCalledTimes(1)
      );
      await waitFor(() =>
        expect(PlayCountByArtistStateEncapsulation).toBeCalledWith(
          received.result.current.userProperties
        )
      );

      expect(mockRetrievePlayCountByArtist).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });
});
