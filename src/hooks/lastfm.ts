import React from "react";
import useAnalytics from "./analytics";
import LastFMTopAlbumsReport from "../clients/api/lastfm/reports/top20.albums.class";
import LastFMTopArtistsReport from "../clients/api/lastfm/reports/top20.artists.class";
import LastFMTopTracksReport from "../clients/api/lastfm/reports/top20.tracks.class";
import { UserContext } from "../providers/user/user.provider";
import type { LastFMUserStateBase } from "../types/user/state.types";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);
  const top20AlbumsReport = new LastFMTopAlbumsReport(
    dispatch,
    analytics.event
  );
  const top20ArtistsReport = new LastFMTopArtistsReport(
    dispatch,
    analytics.event
  );
  const top20TracksReport = new LastFMTopTracksReport(
    dispatch,
    analytics.event
  );

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
    top20AlbumsReport.retrieveReport({ userName });
  };

  const top20artists = (userName: string): void => {
    top20ArtistsReport.retrieveReport({ userName });
  };

  const top20tracks = (userName: string): void => {
    top20TracksReport.retrieveReport({ userName });
  };

  return {
    userProperties: userProperties as LastFMUserStateBase,
    clear,
    ready,
    top20albums,
    top20artists,
    top20tracks,
  };
};

export default useLastFM;
