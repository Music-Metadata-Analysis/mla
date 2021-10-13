import React from "react";
import useAnalytics from "./analytics";
import LastFMTopAlbumsReport from "../clients/api/reports/lastfm/top20.albums.class";
import LastFMTopArtistsReport from "../clients/api/reports/lastfm/top20.artists.class";
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

  const clear = (): void => {
    dispatch({ type: "ResetState" });
  };

  const top20albums = (userName: string): void => {
    top20AlbumsReport.retrieveReport(userName);
  };

  const top20artists = (userName: string): void => {
    top20ArtistsReport.retrieveReport(userName);
  };

  const ready = (): void => {
    dispatch({
      type: "ReadyFetchUser",
      userName: userProperties.userName as string,
      integration: userProperties.data.integration as "LAST.FM",
      data: userProperties.data.report,
    });
  };

  return {
    userProperties: userProperties as LastFMUserStateBase,
    clear,
    ready,
    top20albums,
    top20artists,
  };
};

export default useLastFM;
