import * as status from "../config/status";
import type { StatusMessageType } from "../types/clients/api/api.client.types";

export const knownStatuses: { [index: number]: StatusMessageType } = {
  401: status.STATUS_401_MESSAGE,
  404: status.STATUS_404_MESSAGE,
  429: status.STATUS_429_MESSAGE,
  503: status.STATUS_503_MESSAGE,
};
