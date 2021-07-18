import * as status from "../config/status.js";
import { StatusMessage } from "../types/https.types";

export const postData = async <POSTDATA, RESPONSE>(
  url: string,
  postData: POSTDATA
): Promise<{
  status: number;
  response: RESPONSE | StatusMessage;
}> => {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "same-origin",
    body: JSON.stringify(postData),
  });

  if (response.status === 429) {
    return {
      status: response.status,
      response: status.STATUS_429_MESSAGE,
    };
  }

  if (!response.ok) {
    throw Error(`Error when fetching: ${url}`);
  }

  const json = await response.json();
  return {
    status: response.status,
    response: json as RESPONSE,
  };
};
