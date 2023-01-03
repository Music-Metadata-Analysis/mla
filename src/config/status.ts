import type { APIClientStatusMessageType } from "@src/contracts/api/exports.types";

export const STATUS_400_MESSAGE: APIClientStatusMessageType = {
  detail: "Invalid Request.",
};
export const STATUS_401_MESSAGE: APIClientStatusMessageType = {
  detail: "Unauthorized.",
};
export const STATUS_404_MESSAGE: APIClientStatusMessageType = {
  detail: "Resource not found.",
};
export const STATUS_405_MESSAGE: APIClientStatusMessageType = {
  detail: "Incorrect http method.",
};
export const STATUS_429_MESSAGE: APIClientStatusMessageType = {
  detail: "Ratelimit exceeded.",
};
export const STATUS_502_MESSAGE: APIClientStatusMessageType = {
  detail: "Received error from Last FM.",
};
export const STATUS_503_MESSAGE: APIClientStatusMessageType = {
  detail: "Request timed out, please retry.",
};
