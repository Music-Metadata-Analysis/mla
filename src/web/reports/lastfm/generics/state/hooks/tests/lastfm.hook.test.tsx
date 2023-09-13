import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import React from "react";
import LastFMTopAlbumsReport from "@src/web/api/lastfm/clients/flipcard/top20.albums.class";
import LastFMTopArtistsReport from "@src/web/api/lastfm/clients/flipcard/top20.artists.class";
import LastFMTopTracksReport from "@src/web/api/lastfm/clients/flipcard/top20.tracks.class";
import LastFMPlayCountByArtistDataClient from "@src/web/api/lastfm/clients/sunburst/lastfm.playcount.by.artist.sunburst.client.class";
import { InitialState } from "@src/web/reports/generics/state/providers/report.initial";
import { ReportContext } from "@src/web/reports/generics/state/providers/report.provider";
import mockHookValues from "@src/web/reports/lastfm/generics/state/hooks/__mocks__/lastfm.hook.mock";
import useLastFM from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";
import LastFMReportPlayCountByArtistStateEncapsulation from "@src/web/reports/lastfm/playcount.by.artist/state/encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";
import type { ReportContextInterface } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { ReactNode } from "react";

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/web/api/lastfm/clients/flipcard/top20.albums.class");

jest.mock("@src/web/api/lastfm/clients/flipcard/top20.artists.class");

jest.mock("@src/web/api/lastfm/clients/flipcard/top20.tracks.class");

jest.mock(
  "@src/web/api/lastfm/clients/sunburst/lastfm.playcount.by.artist.sunburst.client.class"
);

jest.mock(
  "@src/web/reports/lastfm/playcount.by.artist/state/encapsulations/lastfm.report.encapsulation.playcount.by.artist.class"
);

interface MockUserContextWithChildren {
  children?: ReactNode;
  mockContext: ReportContextInterface;
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
      <ReportContext.Provider value={mockContext}>
        {children}
      </ReportContext.Provider>
    );
  };

  const arrange = (providerProps: ReportContextInterface) => {
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
        reportProperties: { ...InitialState },
        dispatch: mockDispatch,
      });
    });

    it("should contain the correct properties", () => {
      expect(received.result.current.reportProperties).toStrictEqual(
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
        userName: received.result.current.reportProperties.userName,
        data: received.result.current.reportProperties.data.report,
        integration: received.result.current.reportProperties.data.integration,
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
        expect(LastFMReportPlayCountByArtistStateEncapsulation).toBeCalledTimes(
          1
        )
      );
      await waitFor(() =>
        expect(LastFMReportPlayCountByArtistStateEncapsulation).toBeCalledWith(
          received.result.current.reportProperties
        )
      );

      expect(mockRetrievePlayCountByArtist).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });
});
