import React from "react";
import useAnalytics from "./analytics";
import LastFMReportRequest from "../integrations/lastfm/report.class";
import { UserContext } from "../providers/user/user.provider";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);
  const requests = new LastFMReportRequest(dispatch, analytics.event);

  const top20 = (userName: string): void => {
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
