import { useContext } from "react";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import LastFMTopAlbumsReport from "@src/web/api/lastfm/clients/flipcard/top20.albums.class";
import LastFMTopArtistsReport from "@src/web/api/lastfm/clients/flipcard/top20.artists.class";
import LastFMTopTracksReport from "@src/web/api/lastfm/clients/flipcard/top20.tracks.class";
import LastFMPlayCountByArtistDataClient from "@src/web/api/lastfm/clients/sunburst/lastfm.playcount.by.artist.sunburst.client.class";
import { ReportContext } from "@src/web/reports/generics/state/providers/report.provider";
import LastFMReportPlayCountByArtistStateEncapsulation from "@src/web/reports/lastfm/playcount.by.artist/state/encapsulations/lastfm.report.encapsulation.playcount.by.artist.class";
import type { PlayCountByArtistReportInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.playcount.by.artist.report.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";
import type { FlipCardReportStateQueryConstructor } from "@src/web/reports/lastfm/generics/types/state/queries/flip.card.types";
import type * as sunburstTypes from "@src/web/reports/lastfm/generics/types/state/queries/sunburst.types";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { reportProperties, dispatch } = useContext(ReportContext) as {
    reportProperties: LastFMReportStateBase;
    dispatch: reportDispatchType;
  };

  const createTop20Report = (
    reportQueryClass: FlipCardReportStateQueryConstructor,
    userName: string
  ) => {
    const instance = new reportQueryClass(dispatch, analytics.event);
    instance.retrieveReport({ userName });
  };

  const createSunburstReport = <AggregateReportType,>(
    reportQueryClass: sunburstTypes.SunBurstReportStateQueryConstructor<AggregateReportType>,
    stateEncapsulationClass: sunburstTypes.SunBurstReportStateEncapsulationConstructor<AggregateReportType>,
    userName: string
  ) => {
    const instance = new reportQueryClass(
      dispatch,
      analytics.event,
      new stateEncapsulationClass(reportProperties)
    );
    instance.retrieveReport({ userName });
  };

  const clear = (): void => {
    dispatch({ type: "ResetState" });
  };

  const ready = (): void => {
    dispatch({
      type: "ReadyFetch",
    });
  };

  const top20albums = (userName: string): void => {
    createTop20Report(LastFMTopAlbumsReport, userName);
  };

  const top20artists = (userName: string): void => {
    createTop20Report(LastFMTopArtistsReport, userName);
  };

  const top20tracks = (userName: string): void => {
    createTop20Report(LastFMTopTracksReport, userName);
  };

  const playCountByArtist = (userName: string): void => {
    createSunburstReport<PlayCountByArtistReportInterface[]>(
      LastFMPlayCountByArtistDataClient,
      LastFMReportPlayCountByArtistStateEncapsulation,
      userName
    );
  };

  return {
    reportProperties,
    clear,
    ready,
    top20albums,
    top20artists,
    top20tracks,
    playCountByArtist,
  };
};

export default useLastFM;

export type LastFMHookType = ReturnType<typeof useLastFM>;
