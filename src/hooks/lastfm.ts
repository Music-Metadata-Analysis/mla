import React from "react";
import useAnalytics from "./analytics";
import LastFMPlayCountByArtistDataClient from "../clients/api/lastfm/data/sunburst/playcount.by.artist.sunburst.client.class";
import LastFMTopAlbumsReport from "../clients/api/lastfm/reports/top20.albums.class";
import LastFMTopArtistsReport from "../clients/api/lastfm/reports/top20.artists.class";
import LastFMTopTracksReport from "../clients/api/lastfm/reports/top20.tracks.class";
import PlayCountByArtistStateEncapsulation from "../providers/user/encapsulations/lastfm/sunburst/playcount.by.artist/user.state.playcount.by.artist.sunburst.report.class";
import { UserContext } from "../providers/user/user.provider";
import type { PlayCountByArtistReportInterface } from "../types/clients/api/lastfm/response.types";
import type {
  SunBurstReportConstructor,
  SunBurstEncapsulationConstructor,
} from "../types/clients/api/lastfm/sunburst.types";
import type { Top20ReportConstructor } from "../types/clients/api/lastfm/top20.types";
import type { userDispatchType } from "../types/user/context.types";
import type { LastFMUserStateBase } from "../types/user/state.types";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext) as {
    userProperties: LastFMUserStateBase;
    dispatch: userDispatchType;
  };

  const createTop20Report = (
    reportClass: Top20ReportConstructor,
    userName: string
  ) => {
    const instance = new reportClass(dispatch, analytics.event);
    instance.retrieveReport({ userName });
  };

  const createSunburstReport = <AggregateReportType>(
    reportClass: SunBurstReportConstructor<AggregateReportType>,
    encapsulationClass: SunBurstEncapsulationConstructor<AggregateReportType>,
    userName: string
  ) => {
    const instance = new reportClass(
      dispatch,
      analytics.event,
      new encapsulationClass(userProperties)
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
