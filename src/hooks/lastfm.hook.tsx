import { useContext } from "react";
import useAnalytics from "../web/analytics/collection/state/hooks/analytics.hook";
import PlayCountByArtistStateEncapsulation from "@src/providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import { UserContext } from "@src/providers/user/user.provider";
import LastFMPlayCountByArtistDataClient from "@src/web/api/lastfm/data/sunburst/playcount.by.artist.sunburst.client.class";
import LastFMTopAlbumsReport from "@src/web/api/lastfm/reports/top20.albums.class";
import LastFMTopArtistsReport from "@src/web/api/lastfm/reports/top20.artists.class";
import LastFMTopTracksReport from "@src/web/api/lastfm/reports/top20.tracks.class";
import type { userDispatchType } from "@src/types/user/context.types";
import type { LastFMUserStateBase } from "@src/types/user/state.types";
import type { FlipCardReportStateQueryConstructor } from "@src/web/reports/lastfm/generics/types/state/queries/flip.card.types";
import type * as sunburstTypes from "@src/web/reports/lastfm/generics/types/state/queries/sunburst.types";
import type { PlayCountByArtistReportInterface } from "@src/web/reports/lastfm/playcount.artists/types/state/aggregate.report.types";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = useContext(UserContext) as {
    userProperties: LastFMUserStateBase;
    dispatch: userDispatchType;
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
      new stateEncapsulationClass(userProperties)
    );
    instance.retrieveReport({ userName });
  };

  const clear = (): void => {
    dispatch({ type: "ResetState" });
  };

  const ready = (): void => {
    dispatch({
      type: "ReadyFetch",
      userName: userProperties.userName as string,
      integration: userProperties.data.integration as "LAST.FM",
      data: userProperties.data.report,
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
      PlayCountByArtistStateEncapsulation,
      userName
    );
  };

  return {
    userProperties,
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
