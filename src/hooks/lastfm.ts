import React from "react";
import { UserContext } from "../providers/user/user.provider";
import { LastFMTopAlbumsProxyResponseInterface } from "../types/lastfm.types";
import useAnalytics from "./analytics";
import { postData } from "../utils/http";
import { ProxyRequestInterface } from "../types/proxy.types";
import apiEndpoints from "../config/apiEndpoints";
import Events from "../config/events";

const useLastFM = () => {
  const analytics = useAnalytics();
  const { userProperties, dispatch } = React.useContext(UserContext);

  const retrieveTop20 = (userName: string) => {
    postData<ProxyRequestInterface, LastFMTopAlbumsProxyResponseInterface>(
      apiEndpoints.v1.reports.lastfm.albums,
      {
        userName,
      }
    )
      .then((response) => {
        dispatch({
          type: "SuccessFetchUser",
          userName: userName,
          data: response,
        });
        analytics.event(Events.SuccessProfile);
      })
      .catch((error) => {
        dispatch({
          type: "FailureFetchUser",
          userName: userName,
        });
        analytics.event(Events.ErrorProfile);
      });
  };

  const top20 = (userName: string): void => {
    analytics.event(Events.Search);
    dispatch({
      type: "StartFetchUser",
      userName: userName,
    });
    retrieveTop20(userName);
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
