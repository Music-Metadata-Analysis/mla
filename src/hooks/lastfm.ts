import React from "react";
import useAnalytics from "./analytics";
import LastFMReport from "../clients/api/reports/lastfm.class";
import { UserContext } from "../providers/user/user.provider";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);
  const reports = new LastFMReport(dispatch, analytics.event);

  const top20 = (userName: string): void => {
    reports.retrieveAlbumReport(userName);
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
