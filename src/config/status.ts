import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";

export const STATUS_400_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Invalid Request.",
};
export const STATUS_401_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Unauthorized.",
};
export const STATUS_404_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Resource not found.",
};
export const STATUS_405_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Incorrect http method.",
};
export const STATUS_429_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Ratelimit exceeded.",
};
export const STATUS_502_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Received error from Last FM.",
};
export const STATUS_503_MESSAGE: HttpApiClientStatusMessageType = {
  detail: "Request timed out, please retry.",
};
