import type { StatusMessageType } from "../types/clients/api/api.client.types";

export const STATUS_200_MESSAGE: StatusMessageType = {
  detail: "Not Implemented.",
};
export const STATUS_400_MESSAGE: StatusMessageType = {
  detail: "Invalid Request.",
};
export const STATUS_401_MESSAGE: StatusMessageType = {
  detail: "Unauthorized.",
};
export const STATUS_404_MESSAGE: StatusMessageType = {
  detail: "Resource not found.",
};
export const STATUS_405_MESSAGE: StatusMessageType = {
  detail: "Incorrect http method.",
};
export const STATUS_429_MESSAGE: StatusMessageType = {
  detail: "Ratelimit exceeded.",
};
export const STATUS_502_MESSAGE: StatusMessageType = {
  detail: "Received error from Last FM.",
};
export const STATUS_503_MESSAGE: StatusMessageType = {
  detail: "Request timed out, please retry.",
};
