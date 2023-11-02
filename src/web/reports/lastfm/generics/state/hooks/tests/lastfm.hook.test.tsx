import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import React from "react";
import { createHookWrapper } from "@src/fixtures/mocks/mock.hook.wrapper";
import mockAnalyticsHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
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

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

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
      wrapper: createHookWrapper<MockUserContextWithChildren>(providerWrapper, {
        mockContext: providerProps,
      }),
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
      });
    });
  });

  describe("top20albums", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20albums(mockUserName));
    });

    it("should initialize the LastFMTopAlbumsReport class", async () => {
      await waitFor(() => expect(LastFMTopAlbumsReport).toBeCalledTimes(1));
      expect(LastFMTopAlbumsReport).toBeCalledWith(
        mockDispatch,
        mockAnalyticsHook.event
      );
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() =>
        expect(LastFMTopAlbumsReport.prototype.retrieveReport).toBeCalledTimes(
          1
        )
      );
      expect(
        LastFMTopAlbumsReport.prototype.retrieveReport
      ).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("top20artists", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20artists(mockUserName));
    });

    it("should initialize the LastFMTopArtistsReport class", async () => {
      await waitFor(() => expect(LastFMTopArtistsReport).toBeCalledTimes(1));
      expect(LastFMTopArtistsReport).toBeCalledWith(
        mockDispatch,
        mockAnalyticsHook.event
      );
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() =>
        expect(LastFMTopArtistsReport.prototype.retrieveReport).toBeCalledTimes(
          1
        )
      );
      expect(
        LastFMTopArtistsReport.prototype.retrieveReport
      ).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("top20tracks", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20tracks(mockUserName));
    });

    it("should initialize the LastFMTopTracksReport class", async () => {
      await waitFor(() => expect(LastFMTopTracksReport).toBeCalledTimes(1));
      expect(LastFMTopTracksReport).toBeCalledWith(
        mockDispatch,
        mockAnalyticsHook.event
      );
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() =>
        expect(LastFMTopTracksReport.prototype.retrieveReport).toBeCalledTimes(
          1
        )
      );
      expect(
        LastFMTopTracksReport.prototype.retrieveReport
      ).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });

  describe("playCountByArtist", () => {
    beforeEach(async () => {
      act(() => received.result.current.playCountByArtist(mockUserName));
    });

    it("should initialize the LastFMReportPlayCountByArtistStateEncapsulation class", async () => {
      await waitFor(() =>
        expect(LastFMReportPlayCountByArtistStateEncapsulation).toBeCalledTimes(
          1
        )
      );
      expect(LastFMReportPlayCountByArtistStateEncapsulation).toBeCalledWith(
        received.result.current.reportProperties
      );
    });

    it("should initialize the LastFMPlayCountByArtistDataClient class", async () => {
      await waitFor(() =>
        expect(LastFMPlayCountByArtistDataClient).toBeCalledTimes(1)
      );
      expect(LastFMPlayCountByArtistDataClient).toBeCalledWith(
        mockDispatch,
        mockAnalyticsHook.event,
        jest.mocked(LastFMReportPlayCountByArtistStateEncapsulation).mock
          .instances[0]
      );
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() =>
        expect(
          LastFMPlayCountByArtistDataClient.prototype.retrieveReport
        ).toBeCalledTimes(1)
      );
      expect(
        LastFMPlayCountByArtistDataClient.prototype.retrieveReport
      ).toHaveBeenCalledWith({
        userName: mockUserName,
      });
    });
  });
});
