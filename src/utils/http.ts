export const postData = async <POSTDATA, RESPONSE>(
  url: string,
  postData: POSTDATA
): Promise<RESPONSE> => {
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

  if (!response.ok) {
    throw Error(`Error when fetching: ${url}`);
  }

  const json = await response.json();
  return json;
};
