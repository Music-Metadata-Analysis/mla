import React from "react";
import useAnalytics from "./analytics";
import LastFMTopAlbumsReport from "../clients/api/reports/lastfm/top20.albums.class";
import { UserContext } from "../providers/user/user.provider";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);
  const reports = new LastFMTopAlbumsReport(dispatch, analytics.event);

  const clear = (): void => {
    dispatch({ type: "ResetState" });
  };

  const top20albums = (userName: string): void => {
    reports.retrieveAlbumReport(userName);
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
    userProperties,
    clear,
    ready,
    top20albums,
  };
};

export default useLastFM;
