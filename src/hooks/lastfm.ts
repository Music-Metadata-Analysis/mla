import React from "react";
import Events from "../config/events";
import { UserContext } from "../providers/user/user.provider";
import useAnalytics from "./analytics";
import LastFMReportRequest from "../integrations/lastfm/report.class";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);
  const requests = new LastFMReportRequest(dispatch, analytics.event);

  const top20 = (userName: string): void => {
    analytics.event(Events.LastFM.RequestAlbumsReport);
    dispatch({
      type: "StartFetchUser",
      userName: userName,
    });
    requests.retrieveAlbumReport(userName);
  };

  const clear = (): void => {
    dispatch({ type: "ResetState" });
  };

  return {
    userProperties,
    top20,
    clear,
  };
};

export default useLastFM;
