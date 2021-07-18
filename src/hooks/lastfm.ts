import React from "react";
import useAnalytics from "./analytics";
import Events from "../config/events";
import LastFMReportRequest from "../integrations/lastfm/report.class";
import { UserContext } from "../providers/user/user.provider";

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
